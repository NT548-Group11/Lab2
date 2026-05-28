variable "project_name" {
  description = "Tên của dự án để đặt tên cho các resources"
  type        = string
  default     = "devops-lab2"
}

variable "vpc_cidr_block" {
  description = "Dải CIDR cho toàn bộ mạng VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidr" {
  description = "Dải CIDR cho Public Subnet"
  type        = string
  default     = "10.0.1.0/24"
}

variable "availability_zone" {
  description = "Availability Zone để tạo subnet"
  type        = string
  default     = "us-east-1a"
}
