from django.contrib import admin
from .models import CustomUser

# Register your models here.
@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'score', 'last_score_update')
    list_filter = ('last_score_update',)
    search_fields = ('username',)
    ordering = ('-score',)
