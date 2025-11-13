from django.shortcuts import render
from django.http import JsonResponse
import PyPDF2, docx

def upload(request):
    text = ""
    if request.method == "POST":
        file = request.FILES["document"]
        if file.name.endswith(".pdf"):
            reader = PyPDF2.PdfReader(file)
            text = " ".join([page.extract_text() for page in reader.pages])
        elif file.name.endswith(".docx"):
            doc = docx.Document(file)
            text = " ".join([p.text for p in doc.paragraphs])
        elif file.name.endswith(".txt"):
            text = file.read().decode("utf-8")

    return render(request, "converter/converter.html", {"text": text})

def meaning(request):
    word = request.GET.get("word")
    # 간단한 예시 (실제로는 사전 API나 DB에서 검색)
    dictionary = {
        "computer": ("컴퓨터", "전자 계산기"),
        "psychology": ("심리학", "마음 연구 학문"),
    }
    meaning, simple = dictionary.get(word.lower(), ("뜻을 찾을 수 없습니다.", "-"))
    return JsonResponse({"meaning": meaning, "simple": simple})
