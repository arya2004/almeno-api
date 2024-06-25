
# Almeno Image Analysis

## Overview

This FastAPI application allows users to upload images for color analysis. The uploaded images are processed to extract specific color information, which is then returned as a JSON response.


## How to Run

1. Install dependencies:
   ```sh
   pip install fastapi uvicorn pydantic
   ```

2. Run the application:
   ```sh
   uvicorn main:app --reload
   ```

3. The API will be available at `http://127.0.0.1:8000`.

## Endpoints

### `GET /`
Returns a welcome message.

### `POST /analyze`
Analyzes an uploaded image file and extracts color information.

- Request:
  - `file` (UploadFile): The image file to be analyzed.

- Response:
  - A JSON object containing the extracted color information.

