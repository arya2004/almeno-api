from fastapi import FastAPI,File,UploadFile,HTTPException
from fastapi.middleware.cors import CORSMiddleware
from extractColors import ExtractColors
import os
import shutil

app=FastAPI()
origins=[
    '*'
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
img_dir='images/'
@app.get("/")
def read_root():
    return {"message": "Hello World"}
@app.post("/analyze")
def analyze(file:UploadFile):
    try:
        if file.filename:
            test_file_path=os.path.join(img_dir,file.filename)
            with open(test_file_path,'wb+') as file_obj:
                shutil.copyfileobj(file.file, file_obj)
    except Exception as e:
        raise HTTPException(500,detail="Internal Server Error")
    
    print('[INFO] Uploaded file to {} '.format(test_file_path))
    extractor= ExtractColors(test_file_path)
    extractor.preProcess()
    rgb_val,img_colors=extractor.read_colors()
    if(len(rgb_val)!=10):
        print('[ERROR] Expected Array of length 10 from ExtractColor.read_colors()')
        raise HTTPException(500,detail="Internal Server Error")
    data={
        'URO':rgb_val[0],
        'BIL':rgb_val[1],
        'KET':rgb_val[2],
        'BLD':rgb_val[3],
        'PRO':rgb_val[4],
        'NIT':rgb_val[5],
        'LEU':rgb_val[6],
        'GLU':rgb_val[7],
        'SG':rgb_val[8],
        'PH':rgb_val[9],   
    }
    return data
