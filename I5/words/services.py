import requests
from .models import Word, Definition

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
        print(response.text)
        data = response.json()
        
        
        if('error' in data ):
            error_msg = data['error']['message']
            print(f"[S]API Error for query '{query}': {error_msg}")
            raise Exception(f"[S]API 오류: {error_msg}")
        
        word = Word.objects.create(
        text=query,
        search_count=1, 
        )
        
        # 'channel' -> 'item' (리스트) -> 'sense' -> 'definition' 구조로 파싱
        if( 'channel' in data and 'item' in data['channel'] ):
            items = data['channel']['item']
            
            # '나무1', '나무2' 처럼 여러 item이 올 수 있으므로 모두 저장
            for item_data in items:
                if( 'sense' in item_data and 'definition' in item_data['sense'] ):
                    def_text = item_data['sense']['definition']
                    Definition.objects.create(word=word, text=def_text)

    except requests.exceptions.RequestException as e:
        print(f"[S]API Error for query '{query}': {e}")
        raise Exception("[S]API 호출 실패")

    return word      