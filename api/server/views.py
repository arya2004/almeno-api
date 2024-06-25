from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.conf import settings
from .extractColors import ExtractColors
import os

IMG_DIR = os.path.join(settings.BASE_DIR, 'images')
os.makedirs(IMG_DIR, exist_ok=True)

@csrf_exempt
def ping(request):
    return JsonResponse("Hello", safe=False)

@csrf_exempt
def analyze(request):
    if request.method == 'POST' and request.FILES.get('file'):
        try:
            file = request.FILES['file']
            file_path = os.path.join(IMG_DIR, file.name)
            path = default_storage.save(file_path, ContentFile(file.read()))

            print(f'[INFO] Uploaded file to {file_path}')
            extractor = ExtractColors(file_path)
            extractor.preProcess()
            rgb_val, img_colors = extractor.read_colors()
            if len(rgb_val) != 10:
                print('[ERROR] Expected Array of length 10 from ExtractColor.read_colors()')
                return JsonResponse({'detail': 'Internal Server Error'}, status=500)
            data = {
                'URO': rgb_val[0],
                'BIL': rgb_val[1],
                'KET': rgb_val[2],
                'BLD': rgb_val[3],
                'PRO': rgb_val[4],
                'NIT': rgb_val[5],
                'LEU': rgb_val[6],
                'GLU': rgb_val[7],
                'SG': rgb_val[8],
                'PH': rgb_val[9],
            }
            return JsonResponse(data)
        except Exception as e:
            print(f'[ERROR] {str(e)}')
            return JsonResponse({'detail': 'Internal Server Error'}, status=500)
    else:
        return JsonResponse({'detail': 'File not provided'}, status=400)
