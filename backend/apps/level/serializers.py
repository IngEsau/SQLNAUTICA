from rest_framework import serializers
from .models import Level, Clue, Challenge

class ClueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Clue
        fields = ['id', 'level', 'text', 'order']


class ChallengeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Challenge
        fields = ['id', 'level', 'question', 'answer', 'points']


class LevelSerializer(serializers.ModelSerializer):
    clues = ClueSerializer(many=True, read_only=True)
    challenges = ChallengeSerializer(many=True, read_only=True)

    class Meta:
        model = Level
        fields = ['id', 'name', 'description', 'key', 'created_at', 'clues', 'challenges']