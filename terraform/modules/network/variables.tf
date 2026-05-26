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

variable "public_subnets_cidr" {
  description = "Danh sách các dải CIDR cho Public Subnets"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "availability_zones" {
  description = "Danh sách Availability Zones để tạo subnets (Multi-AZ)"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b"]
}
