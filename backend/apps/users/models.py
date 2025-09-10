from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    score = models.IntegerField(default=0)
    last_score_update = models.DateTimeField(auto_now=True)