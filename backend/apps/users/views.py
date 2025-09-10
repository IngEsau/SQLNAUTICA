from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import CustomUser
from .serializers import UserSerializer, UserRankingSerializer
from rest_framework.permissions import AllowAny

class UserViewSet(viewsets.ModelViewSet):
    """ View to register users """
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]  # Permitir registro sin autenticación

    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def ranking(self, request):
        """funciont to get and updatethe ranking of the users"""
        users = CustomUser.objects.all().order_by('-score', 'last_score_update')
        serializer = UserRankingSerializer(users, many=True)
        return Response(serializer.data)