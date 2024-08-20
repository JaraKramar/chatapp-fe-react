variable "aws_account_num" {
  type    = string
  default = "554025156005"
}

variable "aws_region" {
  description = "The AWS region to deploy resources in"
  type        = string
  default     = "eu-west-3"
}

variable "aws_profile" {
  description = "The AWS CLI profile to use for credentials"
  type        = string
  default     = "default"
  sensitive   = true
}

variable "environment" {
  description = "environment variable for you project"
  type        = string
  default     = "dev"
}

variable "project_name" {
  description = "default name of yout project"
  type        = string
  default     = "csob_rag"
}

variable "task_container_port" {
  description = ""
  type        = number
  default     = 80
}

variable "ecs_service_role" {
  type    = string
  default = "aws-service-role/ecs.amazonaws.com/AWSServiceRoleForECS"

}

variable "ecs_task_execution_role" {
  type    = string
  default = "ecsTaskExecutionRole"

}

variable "ecs_task_role" {
  type    = string
  default = "ecsTaskExecutionRole"

}

variable "local_models_path" {
  type    = string
  default = "/CSOB-RAG/src/local_models"
}
