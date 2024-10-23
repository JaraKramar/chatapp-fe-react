locals {
  account_id=get_env("TF_VAR_account_id")
  region=get_env("TF_VAR_region")
  subsystem=get_env("TF_VAR_subsystem")
  pillar=get_env("TF_VAR_pillar")
  name="${local.subsystem}-frontend"
  tfstate_name="${local.subsystem}-tf-state-${local.account_id}"
  key = "${local.pillar}/${local.region}/terraform/${local.name}/terraform.tfstate"
}

inputs = {
  account_id = local.account_id
  pillar = local.pillar
}

remote_state {
  backend = "s3"
  generate = {
    path      = "backend.tf"
    if_exists = "overwrite_terragrunt"
  }

  config = {
    bucket = local.tfstate_name
    key = local.key
    region = local.region
    encrypt = true
    dynamodb_table = local.tfstate_name
  }
}

// Generates a versions.tf file
generate "versions" {
  path = "versions.tf"
  if_exists = "overwrite_terragrunt"
  contents = <<EOF
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 3.70.0"
    }
  }

  required_version = ">= 1.1.2"
}
EOF
}
