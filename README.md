
- ecs:
    - strimlit
- auth
    - conginito

<!-- # RAG baseline

## What is this?

A starter project for RAG applications. A vanilla python implementation of standard RAG chatbot. -->


<!-- ## How do I run it?

### Setup for Terraform-aws

0. Clone repo: `git clone https://github.com/DataSentics/CSOB-RAG.git`
1. In `~/.aws/credentials` (MacOS) create and save your `aws profile`
2. Correctly change value for tf variable `aws_profile` (`aws profile`) 
3. run `make tf_all`
4. done (try: `terraform plan/apply/..`)

!!THIS repo does not contain IAM-terrafom settings!!

### Run on your local machine

1. In order to start the application locally, you need to create an enviroment with required libraries:

        make venv
        source .venv/bin/activate

2. Create .env file with aws variables:

        AWS_ACCESS_KEY_ID=''
        AWS_SECRET_ACCESS_KEY=''


    `.env.example` file is available
    TODO: add link to aws docs -> how to generate user tokens

4. Update files in folder `src/configs`

    You can create file type json or yaml.
    Use `from src.backend.types.config import settings` in script
    Every file in this folder is then accessible as `settings.<file-name>` in code.

3. Run the application:

    As script:
        `make start`
    As docker container:
        `make build_local`
        `make run`

## Run in AWS ECS -->
