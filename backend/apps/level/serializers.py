from rest_framework import serializers
from .models import Level, Clue, Challenge

class ClueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Clue
        fields = ['id', 'level', 'text', 'order']


class ChallengeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Challenge
        fields = ['id', 'level', 'question', 'answer', 'score', 'code_part']


class LevelSerializer(serializers.ModelSerializer):
    clues = ClueSerializer(many=True, read_only=True)
    challenges = ChallengeSerializer(many=True, read_only=True)

    class Meta:
        model = Level
        fields = ['id', 'name', 'description', 'code', 'created_at', 'clues', 'challenges']


# Serializer to get level details
class LevelDetailSerializer(serializers.ModelSerializer):
    challenges = ChallengeSerializer(many=True, read_only=True)
    clues = ClueSerializer(many=True, read_only=True)
    
    class Meta:
        model = Level
        fields = ['id', 'challenges', 'clues']