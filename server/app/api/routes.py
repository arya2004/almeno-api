from fastapi import APIRouter, UploadFile, HTTPException
from app.utils.file_handler import save_uploaded_file
from app.models.extract_colors import ExtractColors
import os

router = APIRouter()

img_dir = 'images/'

@router.post("/analyze")
def analyze(file: UploadFile):
    """
    Endpoint to analyze an uploaded image file and extract color information.
    """
    try:
        # Save uploaded file to the server
        test_file_path = save_uploaded_file(file, img_dir)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal Server Error")

    print(f'[INFO] Uploaded file to {test_file_path}')
    extractor = ExtractColors(test_file_path)
    extractor.preProcess()
    rgb_val, img_colors = extractor.read_colors()
    
    if len(rgb_val) != 10:
        print('[ERROR] Expected array of length 10 from ExtractColors.read_colors()')
        raise HTTPException(status_code=500, detail="Internal Server Error")
    
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
    return data
