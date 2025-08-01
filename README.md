# Usage

This simple repo provides the multimodel agent. User provides an avatar image and some scripts (text), the agent will convert the avatar into a talking short video.

- Frontend: React + Vite
- Backend: FastAPI
- Model used: Wav2Lip (https://github.com/Rudrabha/Wav2Lip)

<img src="/demo/demo.png" alt="Demo page" width="400"/>

# k8s folder

- frontend/Dockerfile<br>
  This file is used to create docker image only for the frontend.<br>

- frontend_deployment.yaml<br>
  frontend_service.yaml <br>
  The two files are used to deploy only the frontend to K8s.
  <br>

- Dockerfile<br>
  This file is used to create one single image for the whole app.
- fullstack_deployment.yaml<br>
  This file is used to deploy the whole app as one single full-stack app. (have issue in returning the generated video)
