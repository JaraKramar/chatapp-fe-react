module "ecs_cluster" {
  source = "./modules/aws-tf-module-ecs/fargate_cluster"

  name      = var.project_name
  pillar    = var.pillar
  subsystem = var.subsystem

}

module "ecs_task" {
  source = "./modules/aws-tf-module-ecs/task"

  name      = var.project_name
  pillar    = var.pillar
  subsystem = var.subsystem

  cpu        = var.task_cpu
  storage    = 0
  memory     = var.task_memory
  account_id = var.aws_account_fe_num
  task_containers = [
    {
      name               = "${var.project_name}-app"
      image              = "${local.cicd_account_ecr_repo}/rrz-tf-stack-frontend:latest2"
      cpu                = var.task_cpu
      memory             = var.task_memory
      memory_reservation = var.task_memory
      portMappings = [
        {
          containerPort = var.task_container_port
          hostPort      = var.task_container_port
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = "/ecs/${var.project_name}/${var.project_name}-app"
          awslogs-region        = "eu-central-1"
          awslogs-create-group  = true
          awslogs-stream-prefix = "ecs"
        }
      }
      command = []
  }]
}


module "ecs_service" {
  source = "terraform-aws-modules/ecs/aws//modules/service"

  name        = "${local.name_prefix}-${var.project_name}-service"
  cluster_arn = module.ecs_cluster.arn

  create_iam_role = false
  iam_role_arn    = "arn:aws:iam::891377142494:role/aws-service-role/ecs.amazonaws.com/AWSServiceRoleForECS"

  create_task_exec_iam_role = false
  task_exec_iam_role_arn    = module.ecs_task.execution_role_arn

  create_tasks_iam_role = false
  tasks_iam_role_arn    = module.ecs_task.task_role_arn

  cpu    = var.task_cpu
  memory = var.task_memory

  # Enables ECS Exec
  enable_execute_command = true

  # Container definition(s)
  create_task_definition = false
  task_definition_arn    = module.ecs_task.ecs_task_arn

  enable_autoscaling = false

  load_balancer = {
    service = {
      target_group_arn = module.ecs_nlb.target_groups["ex_ecs"].arn
      container_name   = "${var.project_name}-app"
      container_port   = var.task_container_port
    }
  }

  subnet_ids = data.aws_subnets.selected.ids
  security_group_rules = {
    vpc_endpoint_ingress = {
      type        = "ingress"
      from_port   = var.task_container_port
      to_port     = var.task_container_port
      protocol    = "tcp"
      cidr_blocks = [data.aws_vpc.selected.cidr_block]
      # source_security_group_id = module.ecs_nlb.security_group_id
    }
    vpc_endpoint_egress = {
      type        = "egress"
      from_port   = 0
      to_port     = 0
      protocol    = -1
      cidr_blocks = ["0.0.0.0/0"]
    }
  }
  tags = local.tags
}

module "ecs_nlb" {
  source = "terraform-aws-modules/alb/aws"

  name = "${local.name_prefix}-${var.project_name}-nlb"

  load_balancer_type = "network"

  internal = true
  vpc_id   = data.aws_vpc.selected.id
  subnets  = data.aws_subnets.selected.ids

  # For example only
  enable_deletion_protection = false

  # Security Group
  security_group_ingress_rules = {
    all_http = {
      from_port   = var.task_container_port
      to_port     = var.task_container_port
      ip_protocol = "tcp"
      cidr_ipv4   = "0.0.0.0/0"
    }
  }
  security_group_egress_rules = {
    all = {
      ip_protocol = "-1"
      cidr_ipv4   = data.aws_vpc.selected.cidr_block
    }
  }

  listeners = {
    ex_http = {
      port     = var.task_container_port
      protocol = "TCP"

      forward = {
        target_group_key = "ex_ecs"
      }
    }
  }

  target_groups = {
    ex_ecs = {
      protocol                          = "TCP"
      backend_port                      = var.task_container_port
      target_type                       = "ip"
      deregistration_delay              = 5
      load_balancing_cross_zone_enabled = true

      health_check = {
        enabled             = true
        healthy_threshold   = 5
        interval            = 30
        matcher             = "200"
        path                = "/"
        port                = "traffic-port"
        protocol            = "HTTP"
        timeout             = 15
        unhealthy_threshold = 2
      }

      # Theres nothing to attach here in this definition. Instead,
      # ECS will attach the IPs of the tasks to this target group
      create_attachment = false
    }
  }

  tags = local.tags
}
