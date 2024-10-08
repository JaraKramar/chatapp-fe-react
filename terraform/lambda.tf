# module "proxy_backend_lambda" {
#   source = "./modules/aws-tf-module-lambda"

#   name            = "proxy_backend_lambda"
#   region          = var.aws_region
#   pillar          = var.pillar
#   subsystem       = var.pillar
#   account_id      = var.aws_account_fe_num
#   cicd_account_id = var.aws_account_cicd_num

#   private_subnet_tag = "prv"
#   image_version      = "lambda"
#   image_uri          = "730335452162.dkr.ecr.eu-central-1.amazonaws.com/rrz-tf-stack-frontend:lambda"

#   tags = local.tags
# }
