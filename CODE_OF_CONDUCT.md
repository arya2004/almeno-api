
# FastAPI Almeno Image Analysis

## Overview

This FastAPI application allows users to upload images for almeno analysis. The uploaded images are processed to extract specific color information, which is then returned as a JSON response. The following assumptions have been taken into account:

1. The supplied image is in `.jpg` format.
2. The image is not very noisy, i.e., colors are distinguishable to the human eye.

## Tech Stack and Methodology

### Frontend

The frontend is built using ReactJS with Vite as a build tool. Chakra UI is used as the component library, and Axios is used for making HTTP requests.

### Backend

The backend server is built using FastAPI in Python with Uvicorn as the ASGI server. FastAPI is chosen because the scope of the project requires a small number of API routes.

#### Color Extractor

The `extract_colors.py` file contains the main logic for color extraction. The process can be divided into three steps:

1. **Cropping**: Cropping is done to remove the background as it can interfere with color detection.
2. **PreProcessing**: A bilinear extrapolator is used to replace the value of each pixel with the average value of the row to remove artifacts like granular noise and dark patches.
3. **Segmentation**: Small segments of size (2x2) pixels are extracted from the image using a vertical offset to get the color from each square, and the average value of this (2x2) grid is used to determine the final RGB value of the square.


## Setup

### Bare Metal Setup

1. Clone this repository:

   ```sh
   git clone https://github.com/arya2004/almeno-api.git
   ```

2. Navigate to the backend folder, install the required dependencies, and start the web server on port 8000:

   ```sh
   cd ./server/
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```

3. Navigate to the frontend folder, install the required dependencies, and start the web app on port 5173:

   ```sh
   cd ../frontend/
   npm install
   npm run dev
   ```

4. In your browser, navigate to [http://localhost:5173](http://localhost:5173).


## Endpoints

### `GET /`
Returns a welcome message.

### `POST /analyze`
Analyzes an uploaded image file and extracts color information.

- **Request:**
  - `file` (UploadFile): The image file to be analyzed.

- **Response:**
  - A JSON object containing the extracted color information.

## Contributing

We welcome contributions from the community. Please see the [CONTRIBUTING.md](CONTRIBUTING.md) file for more details on how to get involved.

## Code of Conduct

This project adheres to a [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.
