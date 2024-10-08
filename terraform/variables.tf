variable "aws_account_fe_num" {
  type    = string
  default = "891377142494"
}

variable "aws_account_cicd_num" {
  type    = string
  default = "730335452162"
}

variable "aws_region" {
  description = "The AWS region to deploy resources in"
  type        = string
  default     = "eu-central-1"
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

variable "pillar" {
  type    = string
  default = "development"
}

variable "subsystem" {
  type    = string
  default = "rrz"
}

variable "project_name" {
  description = "default name of yout project"
  type        = string
  default     = "rag-frontend"
}

variable "task_container_port" {
  description = ""
  type        = number
  default     = 80
}

variable "ecs_service_role" {
  type    = string
  default = ""

}

variable "ecs_task_execution_role" {
  type    = string
  default = ""

}

variable "ecs_task_role" {
  type    = string
  default = ""

}

variable "task_cpu" {
  type    = number
  default = 4096
}

variable "task_memory" {
  type    = number
  default = 8192
}

variable "react_files" {
  type    = string
  default = "../react/build"

}
