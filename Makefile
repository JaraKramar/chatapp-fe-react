.PHONY: help venv git_submodule

# HELP
# This will output the help for each task
# thanks to https://marmelab.com/blog/2016/02/29/auto-documented-makefile.html
# help: ## This help.
# 	@awk 'BEGIN {FS = ":.*?## "} /^[a-z%A-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

venv: ## set up a simple python virtual environment and install additional pre-commit hooks
	python3 -m venv venv \
	&& . venv/bin/activate \
	&& python3 -m pip install --upgrade pip \
	&& python3 -m pip install -r requirements.txt


IMAGE_NAME = chatbot:1-amd64
CONTAINER_NAME = chatbot-app

AWS_ACCOUNT_NUM = 554025156005

CREDENTIALS := "copy"


help:
	@echo "make build - build the Docker image"
	@echo "make run - run the Docker container"
	@echo "make stop - stop a running container"

build:
	docker build --platform=linux/amd64 -t $(IMAGE_NAME) .

build_local:
	docker build --build-arg CREDENTIALS=true --platform=linux/amd64 -t $(IMAGE_NAME) .

run:
	docker run -p 80:80 --name $(CONTAINER_NAME) $(IMAGE_NAME)

stop:
	docker stop $(CONTAINER_NAME)
	docker rm $(CONTAINER_NAME)

restart:
	make stop
	make build
	make run

init:
	python -m venv venv
	. venv/bin/activate; pip install -Ur requirements.txt

start:
	python3 -m streamlit run src/info.py

push_ecr:
	aws ecr get-login-password --region eu-west-3 | docker login --username AWS --password-stdin $(AWS_ACCOUNT_NUM).dkr.ecr.eu-west-3.amazonaws.com
	docker tag $(IMAGE_NAME) $(AWS_ACCOUNT_NUM).dkr.ecr.eu-west-3.amazonaws.com/csob_rag-dev-ecr:latest
	docker push $(AWS_ACCOUNT_NUM).dkr.ecr.eu-west-3.amazonaws.com/csob_rag-dev-ecr:latest

git_submodule:
	@echo "Initializing submodules..."
	@git submodule init
	@echo "Updating submodules..."
	@git submodule update

tf_all:
	$(MAKE) git_submodule
	@echo "Switching to folder terraform"
	@cd ./terraform && \
		echo "Initializing terraform..." && \
		terraform init
