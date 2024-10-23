module "fe_storage" {
  source = "../submodules/aws-tf-module-s3"
  name   = var.fe_bucket_name
  pillar = var.pillar
  subsystem = var.subsystem
  kms_key_alias = var.s3_kms_alias
  account_id = var.account_id
}