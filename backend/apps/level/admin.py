from django.contrib import admin
from .models import Level, Clue, Challenge

# Register your models here.
@admin.register(Level)
class LevelAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('name', 'code')

@admin.register(Clue)
class ClueAdmin(admin.ModelAdmin):
    list_display = ('level', 'order', 'text')
    list_filter = ('level',)
    search_fields = ('text',)

@admin.register(Challenge)
class ChallengeAdmin(admin.ModelAdmin):
    list_display = ('level', 'question', 'score', 'code_part')
    list_filter = ('level', 'score')
    search_fields = ('question', 'answer', 'code_part')
    fields = ('level', 'question', 'answer', 'score', 'code_part')
