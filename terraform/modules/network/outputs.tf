output "vpc_id" {
  description = "ID của VPC được tạo"
  value       = aws_vpc.main.id
}

output "public_subnets_id" {
  description = "Danh sách ID của các Public Subnets được tạo"
  value       = aws_subnet.public[*].id
}
