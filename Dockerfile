# This file is used to create docker images for the whole application. The frontend is built in a separate stage and static files are copied into the backend image.
# Step 1: Build React frontend
FROM node:18 AS frontend-builder
WORKDIR /app/talking_avatar_app/frontend
COPY frontend/ ./
RUN npm install && npm run build


FROM python:3.11

# Install system-level packages needed for dlib and lws
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    wget \
    git \
    curl \
    libboost-all-dev \
    libgtk2.0-dev \
    libopenblas-dev \
    liblapack-dev \
    libx11-dev \
    libgl1 \
    && apt-get clean

# Set the working dir to the actual app folder
WORKDIR /app/talking_avatar_app
COPY backend/ ./backend/

WORKDIR /app/talking_avatar_app/backend
# Copy frontend build from previous stage
COPY --from=frontend-builder /app/talking_avatar_app/frontend/dist ./frontend_dist

# Install Python packages
RUN pip install --upgrade pip
RUN pip install numpy
RUN pip install -r requirements.txt

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
