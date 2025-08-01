
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import FileResponse, JSONResponse
from gtts import gTTS
import shutil
import subprocess
import os
import uuid
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import sys 
import uvicorn
from fastapi.staticfiles import StaticFiles
import time


current_file = Path(__file__).resolve()
parent_dir = current_file.parent

app = FastAPI()
host = "localhost"
port = 8000


# Allow frontend to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# @app.get("/")
# def root():
#     return {"message": "FastAPI backend running"}

@app.post("/generate-talking-avatar/")
async def generate_video(text: str = Form(...), image: UploadFile = File(...)):
    session_id = str(uuid.uuid4())
    os.makedirs(f"tmp/{session_id}", exist_ok=True)

    # Save uploaded image
    image_path = f"{parent_dir}/tmp/{session_id}/avatar.jpg"
    with open(image_path, "wb") as f:
        shutil.copyfileobj(image.file, f)

    # Generate speech
    tts = gTTS(text)
    audio_path = f"{parent_dir}/tmp/{session_id}/speech.wav"
    tts.save(audio_path)

    # Run SadTalker
    result_dir = f"{parent_dir}/tmp/{session_id}/results"
    os.makedirs(result_dir, exist_ok=True)
    
    cmd = [
        "python3", f"{parent_dir}/Wav2Lip/inference.py",
        "--checkpoint_path", f"{parent_dir}/Wav2Lip/wav2lip_gan.pth",
        "--audio", audio_path,
        "--face", image_path,
        "--outfile", f"{result_dir}/output.mp4",
    ]
    
    try: 
        result = subprocess.run(cmd, capture_output=True, text=True,  check=True)
        if result.returncode != 0:
            print("Error running Wav2Lip:", result.stderr)
            return JSONResponse(status_code=404, content={"error": "Video generation failed."})
        else:
            print("Wav2Lip output:", result.stdout)
        # Print the result of the command
        print("Running Wav2Lip with command:", " ".join(cmd))
        print("Wav2Lip command output:", result.stdout)
    except subprocess.CalledProcessError as e:
        print("Error:", e.stderr)

    # Return the generated video
    for file in os.listdir(result_dir):
        print("Found video file: before if", file)
        if file.endswith(".mp4"):
            return FileResponse(f"{result_dir}/{file}", media_type="video/mp4")

    return JSONResponse(status_code=404, content={"error": "Video generation failed."})

# Serve built React frontend
# app.mount("/", StaticFiles(directory="frontend_dist", html=True), name="frontend")

if __name__ == "__main__":
    uvicorn.run(app, host=host, port=port)