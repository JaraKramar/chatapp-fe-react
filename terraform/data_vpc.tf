data "aws_vpc" "selected" {
  default = false
  filter {
    name   = "tag:subsystemcode"
    values = [upper(var.subsystem)]
  }
}