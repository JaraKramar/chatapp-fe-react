terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket = "rrz-developer-tfstate"
    key    = "dev01/eu-central-1/terraform/rrz-tf-stack-frontend/terraform.tfstate"
    region = "eu-central-1"
    profile = "rrzfe-l3"
  }

  required_version = ">= 1.0.0"
}

provider "aws" {
  region  = var.aws_region
  profile = "rrzfe-l3"
}
