module "api_gateway_frontend" {
  source = "./modules/aws-tf-module-api-gateway"

  name      = "${local.name_prefix}-${var.project_name}-api"
  pillar    = var.pillar
  subsystem = var.subsystem

  stage             = var.pillar
  account_id        = var.aws_account_fe_num
  api_region        = var.aws_region
  description       = "API gateway for static frontend"
  openapi_file_path = "openapi_definition/rrz-development-rag-frontend-api.yaml"
  openapi_params = {
    aws_account_num = var.aws_account_fe_num
    aws_region = var.aws_region
    aws_role = "APIGatewayS3ProxyPolicy"
    aws_s3_bucket = module.s3_bucket_frontend.bucket_name
  }
  disable_execute_api_endpoint = false
  # vpce_endpoint_ids = [data.aws_vpc_endpoint.selected.id]
  vpce_endpoint_ids = []
}


module "api_gateway_frontend_private" {
  source = "./modules/aws-tf-module-api-gateway"

  name      = "${local.name_prefix}-${var.project_name}-private-api"
  pillar    = var.pillar
  subsystem = var.subsystem

  stage             = var.pillar
  account_id        = var.aws_account_fe_num
  api_region        = var.aws_region
  description       = "API gateway for static frontend"
  openapi_file_path = "openapi_definition/rrz-development-rag-frontend-api.yaml"
  openapi_params = {
    aws_account_num = var.aws_account_fe_num
    aws_region = var.aws_region
    aws_role = "APIGatewayS3ProxyPolicy"
    aws_s3_bucket = module.s3_bucket_frontend.bucket_name
  }
  disable_execute_api_endpoint = false
  vpce_endpoint_ids = [aws_vpc_endpoint.vpc_endpoint.id]
}