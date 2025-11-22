import requests
from django.shortcuts import get_object_or_404
from .models import Word, Definition, Bookmark, User

#외부 API키
STD_DICT_KOREAN_URL ='https://stdict.korean.go.kr/api/search.do'
STD_DICT_KOREAN_KEY = '22D9AE46F0578A087A6154FDF8171394'

#많이 검색된 단어의 임계점 _ *디버깅 용으로 작은 수 선택
FREQUENT_THRESHOLD = 3


def find_or_create_word(query):
    '''
    1. 단어를 DB에서 찾음
    2. 없으면 _create_word_from_api 호출

    [param] quary (str) : 검색어
    [return] (Word) 
    '''

    try:
        word = Word.objects.get(text = query)

        word.search_count += 1
        if( word.search_count > FREQUENT_THRESHOLD ):
                word.is_frequent = True
        word.save()
        return word

    except Word.DoesNotExist:
        return _create_word_from_api(query)
        
def _create_word_from_api(query):
    ''' * find_or_create_word 내부에서만 사용

    1. 외부 API에서 query 검색
    2. DB에 새 단어 정보 생성

    [param] quary (str) : 검색어
    [return] (Word) 
    '''
     
    try:
        response = requests.get(STD_DICT_KOREAN_URL,
            params={
            'key' : STD_DICT_KOREAN_KEY,
            'q' : query,
            'req_type' : 'json',
            }
        )

        response.raise_for_status() 
        # print(response.text)

        if not response.text.strip():
            return None

        data = response.json()
        
        
        if('error' in data ):
           return None
        
        channel = data.get('channel')
        if not channel or 'item' not in channel:
            # 검색 결과가 없는 경우 (예: 없는 단어 검색)
            return None

        word = Word.objects.create(
        text=query,
        search_count=1, 
        )

        items = channel['item']
        for item_data in items:
            if 'sense' in item_data and 'definition' in item_data['sense']:
                def_text = item_data['sense']['definition']
                Definition.objects.create(word=word, text=def_text)
        return word

    except requests.exceptions.RequestException as e:
        print(f"[S]API Error for query '{query}': {e}")
        return None
    
    except Exception as e:
        print(f"[S]Unexpected Error: {e}")
        return None    


def toggle_bookmark_services(user, word_id):
    ''''
    [param] user (User) , word_id (int)
    [return] (bool) - 북마크 상태 (True:북마크됨, False:북마크해제)
    '''
    word = get_object_or_404(Word, pk=word_id)
    bookmark = Bookmark.objects.filter(user=user, word=word)
    
    if bookmark.exists():
        bookmark.delete()
        return False
    else:
        Bookmark.objects.create(user=user, word=word)
        return True