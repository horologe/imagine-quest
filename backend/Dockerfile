FROM python
WORKDIR /app
COPY ishikawa-procon-firebase-adminsdk-xrl8i-268be49589.json .
RUN wget https://civitai.com/api/download/models/90854 -O /app/anythingV5Anything_anythingV5PrtRE.safetensors
COPY requirements.txt .
RUN pip install -r /app/requirements.txt
EXPOSE 5000
EXPOSE 3000
COPY main.py .
CMD [ "python3", "main.py" ]
