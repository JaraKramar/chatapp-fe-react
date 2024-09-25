# data "aws_vpc_endpoint" "selected" {
#   filter {
#     name   = "vpc-id"
#     values = [data.aws_vpc.selected.id]
#   }

#   filter {
#     name   = "service-name"
#     values = ["com.amazonaws.${var.aws_region}.execute-api"]
#   }
# }

data "aws_vpc" "default" {
  tags = {
    subsystemcode = upper(var.subsystem)
  }
}

resource "aws_security_group" "api_gw_sg" {
  name        = "api-gw-vpce-sg"
  description = "Allow TLS inbound traffic"
  vpc_id      = data.aws_vpc.default.id

  egress {
    from_port        = 80
    to_port          = 8443
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  ingress {
    from_port        = 80
    to_port          = 8443
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  lifecycle {
    create_before_destroy = true
  }

  timeouts {
    delete = "45m" // reason details https://registry.terraform.io/providers/hashicorp/aws/2.58.0/docs/resources/security_group
  }
}

resource "aws_vpc_endpoint" "vpc_endpoint" {
  private_dns_enabled = true
  security_group_ids  = [aws_security_group.api_gw_sg.id]
  service_name        = "com.amazonaws.${var.aws_region}.execute-api"
  subnet_ids          = data.aws_subnets.selected.ids
  vpc_endpoint_type   = "Interface"
  vpc_id              = data.aws_vpc.default.id
}