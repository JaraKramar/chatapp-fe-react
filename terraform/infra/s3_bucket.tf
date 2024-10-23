module "fe_storage" {
  source = "../submodules/aws-tf-module-s3"
  name   = var.fe_bucket_name
  pillar = var.pillar
  subsystem = var.subsystem
  kms_key_alias = data.aws_kms_alias.s3_cmk.target_key_arn
  account_id = var.account_id
}

data "aws_kms_alias" "s3_cmk" {
  name = var.s3_kms_alias
}