from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LevelViewSet, ClueViewSet, ChallengeViewSet

router = DefaultRouter()
router.register(r'levels', LevelViewSet)
router.register(r'clues', ClueViewSet)
router.register(r'challenges', ChallengeViewSet)

urlpatterns = [
    path('', include(router.urls)),
]