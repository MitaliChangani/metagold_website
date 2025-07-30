
from django.http import JsonResponse, HttpResponse

def home(request):
    return HttpResponse("<h1>{'message': 'Welcome to the MetaGold API'}<h1/>")