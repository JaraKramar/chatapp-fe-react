# output "alias" {
#   value = module.s3_bucket_frontend_main_kms.aliases[0]
# }

# output "files" {
#   value = local.react_files
# }

output "openapi" {
  value = {
    aws_region = var.aws_account_fe_num
    aws_role = "APIGatewayS3ProxyPolicy"
    aws_s3_bucket = module.s3_bucket_frontend.bucket_name
  }
}
