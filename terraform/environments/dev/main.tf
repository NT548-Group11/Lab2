# Cấu hình AWS Provider
provider "aws" {
  region = var.aws_region
}

# 1. Gọi Module Network
module "network" {
  source = "../../modules/network"

  project_name       = var.project_name
  vpc_cidr_block     = "10.0.0.0/16"
  public_subnet_cidr = "10.0.1.0/24"
  availability_zone  = "${var.aws_region}a"
}

# 2. Gọi Module Compute
module "compute" {
  source = "../../modules/compute"

  project_name  = var.project_name
  ami_id        = var.ami_id
  key_name      = var.key_name
  
  vpc_id        = module.network.vpc_id
  subnet_id     = module.network.public_subnet_id
}
