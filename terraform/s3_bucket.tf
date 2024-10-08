module "s3_bucket_frontend_main_kms" {
  source = "./modules/aws-tf-module-kms"

  key_name      = "s3_bucket_frontend_main_kms"
  aliasList     = ["s3_bucket_frontend_main_kms"]
  service_names = ["kms:EncryptionContext:aws:s3:${local.name_prefix}-${var.project_name}-bucket"]
  account_id    = var.aws_account_fe_num
  region        = var.aws_region

}

module "s3_bucket_frontend" {
  source = "./modules/aws-tf-module-s3"

  name          = var.project_name
  pillar        = var.pillar
  subsystem     = var.subsystem
  kms_key_alias = module.s3_bucket_frontend_main_kms.aliases[0]

}

resource "aws_s3_object" "s3_bucket_frontend_object" {
  for_each = { for file in local.react_files : file => file }

  bucket = module.s3_bucket_frontend.bucket_name
  key    = each.value
  source = "${var.react_files}/${each.value}"
  etag   = filemd5("${var.react_files}/${each.value}")
}
