locals {
  tags = {
    Name      = var.project_name,
    Subsystem = var.subsystem,
    Pillar    = var.pillar
  }

  aws_ecs_service_name = "${var.project_name}-service"
  cicd_account_ecr_repo = "730335452162.dkr.ecr.eu-central-1.amazonaws.com"

  name_prefix = "${var.subsystem}-${var.pillar}"

  role_be_prefix = "arn:aws:iam::${var.aws_account_fe_num}:role"

  # ecs_service_role        = "${local.role_be_prefix}/${var.ecs_service_role}"
  # ecs_task_execution_role = "${local.role_be_prefix}/${var.ecs_task_execution_role}"
  # ecs_task_role           = "${local.role_be_prefix}/${var.ecs_task_role}"

  availability_zones        = ["${var.aws_region}a", "${var.aws_region}b", "${var.aws_region}c"]
  
  }