variable "project_name" {
  description = "Tên của dự án để đặt tên cho các resources"
  type        = string
  default     = "devops-lab2"
}

variable "aws_region" {
  description = "AWS Region"
  type        = string
  default     = "ap-southeast-1"
}

variable "ami_id" {
  description = "AMI ID của Ubuntu 22.04 (Region ap-southeast-1)"
  type        = string
  default     = "ami-05cf1e9f73fbad2e2" #Ubuntu Server 24.04 LTS (HVM), SSD
}

variable "key_name" {
  description = "Tên SSH Key Pair"
  type        = string
  default     = "devops-lab2-key"
}