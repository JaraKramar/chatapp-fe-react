
IMAGE_NAME = rrz_frontend:amd64
CONTAINER_NAME = rrz_frontend_app

AWS_ACCOUNT_NUM = 975050254771
AWS_ACCOUNT_CICD_NUM = 730335452162
AWS_CICD_REPO_NAME = rrz-tf-stack-frontend

venv:
	python3.11 -m venv venv \
	&& . venv/bin/activate
	pip3.11 install --trusted-host pypi.org --trusted-host files.pythonhosted.org -Ur requirements.txt


build:
	docker build --platform=linux/amd64 -t ${IMAGE_NAME} .


build_local:
	docker build --build-arg CREDENTIALS=true --platform=linux/amd64 -t $(IMAGE_NAME) .


run:
	docker run -p 8080:8080 --name $(CONTAINER_NAME) $(IMAGE_NAME)

stop:
	docker stop $(CONTAINER_NAME)
	docker rm $(CONTAINER_NAME)

docker_login:
	aws ecr get-login-password --region eu-central-1 --profile rrzcicd-l3 | docker login --username AWS --password-stdin $(AWS_ACCOUNT_CICD_NUM).dkr.ecr.eu-central-1.amazonaws.com


docker_push:
	docker tag $(IMAGE_NAME) $(AWS_ACCOUNT_CICD_NUM).dkr.ecr.eu-central-1.amazonaws.com/$(AWS_CICD_REPO_NAME):latest2
	docker push $(AWS_ACCOUNT_CICD_NUM).dkr.ecr.eu-central-1.amazonaws.com/$(AWS_CICD_REPO_NAME):latest2

docker_clean:
	docker rmi $(docker images -f dangling=true -q)
	docker builder prune