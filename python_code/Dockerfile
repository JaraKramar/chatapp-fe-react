#!/bin/bash
# FROM public.ecr.aws/sam/build-python3.11:1.123.0-x86_64
# Define a build argument
ARG CREDENTIALS=false

FROM 730335452162.dkr.ecr.eu-central-1.amazonaws.com/rrz-build-python3.11:1.123.0-x86_64

WORKDIR /app

COPY . /app

RUN pip3.11 install --trusted-host pypi.org --trusted-host https://download.pytorch.org/  --trusted-host files.pythonhosted.org --trusted-host files.pythonhosted.org  -r requirements.txt

EXPOSE 80

ENTRYPOINT ["streamlit", "run", "ChatApp.py", "--server.port=80", "--server.address=0.0.0.0"]

