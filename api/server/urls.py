from django.urls import path
from .views import ping, analyze

urlpatterns = [
    path('hello/', ping, name='ping'),
    path('analyze/', analyze, name='analyze'),
]
