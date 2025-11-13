from django.shortcuts import render, redirect, get_object_or_404
from django.views.decorators.http import require_POST

from .services import find_or_create_word
from .models import Word, Bookmark
# Create your views here.

def word_search(request):
    '''
    /words/dictionary/
    '''

    query = request.GET.get('query')
    word = None
    error_message = None

    if( query ):
        try:
            word = find_or_create_word(query)
        except Exception as e:
            print(f"[V]Error in word_search : {e}")
            error_message = str(e)

    context = {
        'query' : query, #검색어
        'word' : word,  #검색 단어 저장
        'error_message' : error_message,
    }
    
    return render(request, 'words/word_search.html', context)