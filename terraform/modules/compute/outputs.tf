output "ec2_public_ip" {
  description = "IP Public của máy ảo EC2"
  value       = aws_instance.web.public_ip
}

output "ec2_id" {
  description = "ID của máy ảo EC2"
  value       = aws_instance.web.id
}
