from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db import connection
import sqlite3
import os
from django.conf import settings
from .models import Level, Clue, Challenge
from .serializers import LevelSerializer, ClueSerializer, ChallengeSerializer, LevelDetailSerializer

class LevelViewSet(viewsets.ModelViewSet):
    """ Viewset to levels """
    queryset = Level.objects.all()
    serializer_class = LevelSerializer

    @action(detail=True, methods=['get'], url_path='detail')
    def get_level_detail(self, request, pk=None):
        """
        Endpoint to get level by ID
        """
        level = get_object_or_404(Level, pk=pk)
        serializer = LevelDetailSerializer(level)
        return Response(serializer.data)


class ClueViewSet(viewsets.ModelViewSet):
    """ Viewset to clues """
    queryset = Clue.objects.all()
    serializer_class = ClueSerializer


class ChallengeViewSet(viewsets.ModelViewSet):
    """ Viewset to challenges """
    queryset = Challenge.objects.all()
    serializer_class = ChallengeSerializer


# Endpoint to execute SQL queries
@api_view(['POST'])
def execute_sql(request, level_id):
    """
    Endpoint to execute SQL queries
    Body: 
        
            {
                "sql": "CREATE TABLE mochila (id INTEGER PRIMARY KEY, item TEXT);"
            }

            {
                "sql": "INSERT INTO mochila (item) VALUES ('lampara');"
            }
            
            {
                "sql": "SELECT * FROM mochila;"
            }
    """
    level = get_object_or_404(Level, pk=level_id)
    sql_query = request.data.get('sql', '').strip()
    
    if not sql_query:
        return Response(
            {"error": "SQL query is required"}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        # Create connection to SQLite specific for the level
        db_path = os.path.join(settings.BASE_DIR, f'level_{level_id}_db.sqlite3')
        
        with sqlite3.connect(db_path) as conn:
            cursor = conn.cursor()
            cursor.execute(sql_query)
            
            # If it is a SELECT query, get the results
            if sql_query.upper().startswith('SELECT'):
                results = cursor.fetchall()
                columns = [description[0] for description in cursor.description] if cursor.description else []
                
                return Response({
                    "success": True,
                    "message": "Query executed successfully",
                    "results": results,
                    "columns": columns
                })
            else:
                # INSERT, UPDATE, DELETE, CREATE TABLE, etc.
                conn.commit()
                return Response({
                    "success": True,
                    "message": "Query executed successfully",
                    "affected_rows": cursor.rowcount
                })
                
    except sqlite3.Error as e:
        return Response(
            {"error": f"SQL Error: {str(e)}"}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {"error": f"Unexpected error: {str(e)}"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def verify_code(request, level_id):
    """
    Endpoint to verify level code
    Body: {"code": "123"}
    """
    level = get_object_or_404(Level, pk=level_id)
    provided_code = request.data.get('code', '')
    
    if level.code == provided_code:
        return Response(
            "nivel completado!", 
            status=status.HTTP_200_OK
        )
    else:
        return Response(
            "Error vuelve a intentar!", 
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['POST'])
def validate_challenge(request, level_id, challenge_id):
    """
    Endpoint to validate if a challenge is completed correctly
    Body: 
        
            {
                "sql": "CREATE TABLE mochila (id INTEGER PRIMARY KEY, item TEXT);"
            }

            {
                "sql": "INSERT INTO mochila (item) VALUES ('lampara');"
            }
            
            {
                "sql": "SELECT * FROM mochila;"
            }
    """
    level = get_object_or_404(Level, pk=level_id)
    challenge = get_object_or_404(Challenge, pk=challenge_id, level=level)
    sql_query = request.data.get('sql', '').strip()
    
    if not sql_query:
        return Response(
            {"error": "SQL query is required"}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        # Normalize the queries for comparison
        user_sql = sql_query.lower().strip().replace(';', '').replace('  ', ' ')
        expected_sql = challenge.answer.lower().strip().replace(';', '').replace('  ', ' ')
        
        # Verify if the user query matches the expected answer
        if user_sql == expected_sql:
            return Response({
                "success": True,
                "message": "¡Reto completado correctamente!",
                "score": challenge.score,
                "challenge_id": challenge.id
            })
        else:
            return Response({
                "success": False,
                "message": "La consulta no coincide con la respuesta esperada",
                "expected": challenge.answer,
                "received": sql_query
            }, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        return Response(
            {"error": f"Validation error: {str(e)}"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )