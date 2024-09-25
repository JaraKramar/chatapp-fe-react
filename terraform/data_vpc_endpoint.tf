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