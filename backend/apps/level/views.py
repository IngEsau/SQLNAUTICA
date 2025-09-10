from rest_framework import viewsets
from .models import Level, Clue, Challenge
from .serializers import LevelSerializer, ClueSerializer, ChallengeSerializer

class LevelViewSet(viewsets.ModelViewSet):
    """ Viewset to levels """
    queryset = Level.objects.all()
    serializer_class = LevelSerializer


class ClueViewSet(viewsets.ModelViewSet):
    """ Viewset to clues """
    queryset = Clue.objects.all()
    serializer_class = ClueSerializer


class ChallengeViewSet(viewsets.ModelViewSet):
    """ Viewset to challenges """
    queryset = Challenge.objects.all()
    serializer_class = ChallengeSerializer