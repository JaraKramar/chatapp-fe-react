resource "aws_api_gateway_vpc_link" "embedding_model_app_vpc_link" {
  name        = "${local.name_prefix}-${var.project_name}-vpc-link"
  description = "VPC link with NLB target (for embedding model app in ECS)"
  target_arns = [module.ecs_nlb.arn]

  tags = local.tags

}

# module "api_gateway_embedding_model" {
#   source = "./modules/aws-tf-module-api-gateway"

#   name      = "${local.name_prefix}-${var.project_name}-api"
#   pillar    = var.pillar
#   subsystem = var.subsystem

#   stage             = var.pillar
#   account_id        = var.aws_account_fe_num
#   api_region        = var.aws_region
#   description       = "API gateway for embedding model"
#   openapi_file_path = "openapi_definition/embedding-model-api.yaml"
#   openapi_params = {
#     aws_vpc_link = aws_api_gateway_vpc_link.embedding_model_app_vpc_link.id
#     ecs_nlb      = module.ecs_nlb.dns_name
#   }
#   disable_execute_api_endpoint = false

#   vpce_endpoint_ids = [data.aws_vpc_endpoint.selected.id]
# }
