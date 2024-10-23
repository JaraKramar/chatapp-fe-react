
variable "account_id" {
  type = string
}
variable "subsystem" {
  type = string
}
variable "region" {
  type = string
}
variable "pillar" {
  type = string
}
variable "fe_bucket_name" {
  type = string
}

variable "s3_kms_alias" {
  default = "alias/cmk/s3"
}