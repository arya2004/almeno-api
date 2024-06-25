import os
import shutil
from fastapi import UploadFile, HTTPException

def save_uploaded_file(file: UploadFile, directory: str) -> str:
    """
    Save the uploaded file to the specified directory.

    Args:
        file (UploadFile): The uploaded file object.
        directory (str): The directory to save the file to.

    Returns:
        str: The path to the saved file.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded")
    
    if not os.path.exists(directory):
        os.makedirs(directory)
    
    file_path = os.path.join(directory, file.filename)
    with open(file_path, 'wb+') as file_obj:
        shutil.copyfileobj(file.file, file_obj)
    
    return file_path
