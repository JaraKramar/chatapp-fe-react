terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket = "csob-rag-dev-tf-backend"
    key    = "v1/terraform.tfstate"
    region = "eu-west-3"
  }

  required_version = ">= 1.0.0"
}

provider "aws" {
  region  = var.aws_region
  profile = var.aws_profile
}
