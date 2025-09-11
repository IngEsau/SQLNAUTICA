from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LevelViewSet, ClueViewSet, ChallengeViewSet, execute_sql, verify_code, validate_challenge

router = DefaultRouter()
router.register(r'levels', LevelViewSet)
router.register(r'clues', ClueViewSet)
router.register(r'challenges', ChallengeViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('<int:level_id>/execute-sql/', execute_sql, name='execute-sql'),
    path('<int:level_id>/verify-code/', verify_code, name='verify-code'),
    path('<int:level_id>/challenges/<int:challenge_id>/validate/', validate_challenge, name='validate-challenge'),
]