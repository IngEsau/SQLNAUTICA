from django.db import models

class Level(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    code = models.CharField(max_length=10, unique=True, default='0000')  # Código de finalización del nivel
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

# Pistas
class Clue(models.Model):
    level = models.ForeignKey(Level, related_name='clues', on_delete=models.CASCADE)
    text = models.TextField()
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"Clue {self.order} for {self.level.name}"

# Retos
class Challenge(models.Model):
    level = models.ForeignKey(Level, related_name='challenges', on_delete=models.CASCADE)
    question = models.TextField()
    answer = models.CharField(max_length=200)
    score = models.IntegerField(default=0)

    def __str__(self):
        return f"Challenge for {self.level.name}"