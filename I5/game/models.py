from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class GameUserScore(models.Model):
    score = models.IntegerField(default=0)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    player_name = models.CharField(max_length=50, default="익명")
    date = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date'] # 최신순 정렬 기본값

    def __str__(self):
        return f"{self.user.username} - {self.score}점"