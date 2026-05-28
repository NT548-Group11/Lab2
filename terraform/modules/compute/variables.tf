variable "project_name" {
  description = "Tên của dự án để đặt tên cho các resources"
  type        = string
  default     = "devops-lab2"
}

variable "vpc_id" {
  description = "ID của VPC để đặt Security Group"
  type        = string
}

variable "subnet_id" {
  description = "ID của Public Subnet"
  type        = string
}

variable "instance_type" {
  description = "Loại instance của đơn vị compute"
  type        = string
  default     = "t2.micro"
}

variable "ami_id" {
  description = "AMI ID của hệ điều hành (ví dụ Ubuntu 22.04)"
  type        = string
  default = "ami-05cf1e9f73fbad2e2" #Ubuntu Server 24.04 LTS (HVM), SSD
}

variable "key_name" {
  description = "SSH key pair name"
  type        = string
  default     = "devops-lab2-key"
}