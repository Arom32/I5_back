from django.db import models

# Create your models here.
class Word(models.Model):
    '''
    검색된 단어를 저장하는 모델
    '''
    text = models.CharField(max_length=100)
    search_count = models.IntegerField(default=0)
    is_frequent = models.BooleanField(default=False)

    def __str__(self):
        return self.text
    
class Definition(models.Model):
    '''
    단어의 뜻을 저장하는 모델
    Word와 1:N관계, Word가 삭제 될 시 Definition도 삭제 
    '''
    word = models.ForeignKey(Word, related_name='definitions', on_delete=models.CASCADE)
    text = models.TextField()

    def __str__(self):
        return f"{self.word.text}: {self.text[:20]}..."
    

class Bookmark(models.Model):
    '''
    북마크된 단어를 저장하는 모델
    user와 M:N 관계
    '''
    # user = models.ForeignKey(Word, on_delete=models.CASCADE)
    word = models.ForeignKey(Word, on_delete=models.CASCADE)

    # class Meta:
    #     # 한 유저가 같은 단어를 중복 북마크하는 것 방지
    #     unique_together = ('user','word')

    def __str__(self):
        pass