output "vpc_id" {
  description = "ID của VPC được tạo"
  value       = aws_vpc.main.id
}

output "public_subnet_id" {
  description = "ID của Public Subnet được tạo"
  value       = aws_subnet.public.id
}
