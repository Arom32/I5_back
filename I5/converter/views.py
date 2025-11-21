'''
from django.shortcuts import render
from django.http import JsonResponse
import PyPDF2, docx
#import pyhwp  # HWP 처리를 위해 임포트
import tempfile # 임시 파일 사용을 위해 임포트
import os       # 임시 파일 삭제를 위해 임포트

from words.services import find_or_create_word

def upload(request):
    paragraphs = []  # 단일 text 문자열 대신 list 사용
    if request.method == "POST":
        file = request.FILES["document"]

        if file.name.endswith(".pdf"):
            reader = PyPDF2.PdfReader(file)
            for page in reader.pages:
                page_text = page.extract_text()
                # 페이지 텍스트를 줄바꿈 기준으로 나누어 리스트에 추가
                paragraphs.extend(page_text.split('\n'))

        elif file.name.endswith(".docx"):
            doc = docx.Document(file)
            # 각 문단을 리스트의 요소로 추가 (빈 문단 제외)
            paragraphs = [p.text for p in doc.paragraphs if p.text]

        elif file.name.endswith((".hwp", ".hwpx")): # HWP 및 HWPX 지원
            # pyhwp는 파일 경로가 필요하므로 임시 파일 생성
            with tempfile.NamedTemporaryFile(delete=False, suffix=file.name) as temp_file:
                for chunk in file.chunks():
                    temp_file.write(chunk)
                temp_file_path = temp_file.name
            
            try:
                # HWPReader를 사용하여 텍스트 추출
                hwp = pyhwp.HWPReader(temp_file_path)
                body_text = hwp.get_text()
                # 추출된 텍스트를 줄바꿈 기준으로 나누어 리스트에 추가
                paragraphs = body_text.split('\n')
            except Exception as e:
                print(f"HWP 파일 처리 오류: {e}")
                paragraphs = ["HWP 파일을 읽는 중 오류가 발생했습니다."]
            finally:
                os.remove(temp_file_path) # 임시 파일 삭제

        elif file.name.endswith(".txt"):
            text = file.read().decode("utf-8")
            # 텍스트 파일을 줄바꿈 기준으로 나누어 리스트에 추가
            paragraphs = text.splitlines()

    # 공백만 있는 문단 리스트에서 제거
    paragraphs = [p for p in paragraphs if p.strip()]

    # text 대신 paragraphs 리스트를 템플릿에 전달
    return render(request, "converter/converter.html", {"paragraphs": paragraphs})



def meaning(request):
    word = request.GET.get("word")
    
    # [수정] word가 None일 때 (즉, ?word=... 파라미터가 없을 때)
    # 에러를 내지 않고 '뜻을 찾을 수 없음'을 반환합니다.
    if word is None:
        return JsonResponse({"definitions": "단어를 입력하세요", "word":""})

    # word가 None이 아닐 때만 .lower()와 .strip()을 실행합니다.
    punctuation = ".,!?;:\"'()[]{}" 
    cleaned_word = word.lower().strip(punctuation) 
    
    if not cleaned_word:
        return JsonResponse({"definitions" : ["뜻을 찾을 수 없는 단어입니다."], "word" : word})

    try:
        # 2. [수정] services의 함수를 호출하여 Word 객체를 받습니다.
        word_obj = find_or_create_word(cleaned_word)
        
        # 3. [수정] Word 객체에 연결된 모든 Definition들을 가져옵니다.
        #    (models.py에서 Definition -> Word의 ForeignKey related_name이 
        #     기본값인 'definition_set'이라 가정)
        definitions = word_obj.definitions.all()
        
        # 4. [수정] Definition의 텍스트만 뽑아서 리스트로 만듭니다.
        def_list = [d.text for d in definitions]
        
        # 5. [수정] 만약 API에서 뜻을 못찾아 def_list가 비어있을 경우
        if not def_list:
            def_list = ["사전에서 뜻을 찾을 수 없습니다."]

        # 6. [수정] 'simple' 대신 'definitions' (뜻 목록)을 반환합니다.
        return JsonResponse({"definitions": def_list, "word": cleaned_word})

    except Exception as e:
        # 7. [추가] find_or_create_word (API 호출 등)에서 오류 발생 시
        print(f"Error in meaning view: {e}")
        # services.py에서 'raise Exception(...)' 한 것을 여기서 잡습니다.
        return JsonResponse({"definitions": [f"사전 검색 중 오류 발생: {str(e)}"], "word": cleaned_word}, status=500)
'''        
from django.shortcuts import render
from django.http import JsonResponse
import PyPDF2, docx
from konlpy.tag import Okt  # 여기는 OK
import tempfile, os 
from words.services import find_or_create_word # <-- 이게 다시 필요합니다!

okt=Okt()

def upload(request):
    print("--디버깅 1. upload 뷰에 요청 도착착")
    paragraphs = []
    if request.method == "POST":
        try:
            file = request.FILES["document"]
            print(f"--디버깅 2. 파일 수신 완료. 파일명: {file.name}")
            if file.name.endswith(".pdf"):
                reader = PyPDF2.PdfReader(file)
                for page in reader.pages:
                    page_text = page.extract_text()
                    if page_text:
                        paragraphs.extend(page_text.split('\n'))

            elif file.name.endswith(".docx"):
                doc = docx.Document(file)
                paragraphs = [p.text for p in doc.paragraphs if p.text]

            elif file.name.endswith(".txt"):
                text = file.read().decode("utf-8")
                paragraphs = text.splitlines()

            paragraphs = [p for p in paragraphs if p.strip()]
            print(f"--디버깅 3. 파일 처리 완료. docs3.html렌더링")
            return render(request,"converter/docs3.html",{"paragraphs":paragraphs})
        except PyPDF2.errors.PdfReadError as e:
        # PDF 암호 오류 등 PyPDF2 관련 오류 처리
            print(f"--- [오류] PDF 처리 오류 발생: {e} ---")
            return render(request, "converter/converter.html", {"error": "PDF 파일을 읽을 수 없습니다. 파일이 손상되었거나 암호화되어 있습니다."})
        
        except KeyError:
            # request.FILES["document"]가 없을 경우 (HTML 폼 문제)
            print("--- [오류] 폼 제출 문제: 'document' 파일을 찾을 수 없음. ---")
            return render(request, "converter/converter.html", {"error": "파일이 올바르게 첨부되지 않았습니다."})
        
        except Exception as e:
            # 기타 예상치 못한 모든 오류 처리
            print(f"--- [심각 오류] 파일 처리 중 예상치 못한 오류 발생: {e} ---")
            return render(request, "converter/converter.html", {"error": f"파일 처리 중 오류가 발생했습니다: {e}"})

    # GET 요청 시 (처음 접속)
    print("--- [디버깅] 4. GET 요청: converter.html 렌더링 ---")
    #return render(request, "converter/converter.html", {"paragraphs": paragraphs})
    return render(request, "converter/converter.html")


def meaning(request):
    word = request.GET.get("word")
    
    if not word:
        return JsonResponse({"definitions": ["단어 없음"], "word": ""})

    # 3. KoNLPy로 단어를 '정리'합니다 (구두점 제거)
    punctuation = ".,!?;:\"'()[]{}" 
    cleaned_word = word.strip(punctuation) # 예: "컴퓨터를." -> "컴퓨터를"

    if not cleaned_word:
         return JsonResponse({"definitions": ["뜻을 찾을 수 없는 단어입니다."], "word": word})

    # 4. KoNLPy로 '핵심 단어'(명사, 동사 등)를 추출합니다.
    # 'stem=True'로 기본형을 찾습니다.
    pos_tags = okt.pos(cleaned_word, stem=True)
    
    search_word = None
    for tag, pos in pos_tags:
        # 명사, 동사, 형용사, 알파벳만 검색 대상으로 인정
        if pos in ['Noun', 'Verb', 'Adjective', 'Alpha']:
            search_word = tag
            break
    
    # 적절한 단어를 못찾으면 그냥 정리된 단어(조사 뗀 단어)를 사용
    if search_word is None:
        search_word = cleaned_word.rstrip('을를이가는은도') # 간단한 조사 제거
    
    # 5. [매우 중요] KoNLPy가 찾은 '핵심 단어'로 '사전'을 검색합니다.
    try:
        # 'okt.morphs()'가 아니라 'find_or_create_word'를 호출해야 합니다!
        word_obj = find_or_create_word(search_word) # 예: "컴퓨터"로 검색
        
        # 6. '뜻'을 가져옵니다.
        definitions = word_obj.definitions.all()
        def_list = [d.text for d in definitions]
        
        if not def_list:
            def_list = ["사전에서 뜻을 찾을 수 없습니다."]

        # 7. '뜻 리스트'를 반환합니다.
        return JsonResponse({"definitions": def_list, "word": search_word})

    except Exception as e:
        # 8. 'find_or_create_word' 실행 중 에러가 나면 (API, DB 등)
        print(f"Error in meaning view (service call): {e}") # 서버 터미널에 로그
        return JsonResponse({"definitions": [f"사전 검색 중 오류 발생: {str(e)}"], "word": search_word}, status=500)
