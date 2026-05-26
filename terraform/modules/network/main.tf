# Khởi tạo một VPC (Virtual Private Cloud) - Mạng riêng ảo của bạn trên AWS
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr_block
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "${var.project_name}-vpc"
  }
}

# Tạo các Public Subnet dựa trên danh sách dải IP được truyền vào
resource "aws_subnet" "public" {
  count                   = length(var.public_subnets_cidr) # Tạo số lượng Subnet bằng với số phần tử trong list CIDR
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.public_subnets_cidr[count.index]
  availability_zone       = var.availability_zones[count.index]
  map_public_ip_on_launch = true # Tự động cấp Public IP cho EC2 để có thể truy cập từ ngoài vào

  tags = {
    Name = "${var.project_name}-public-subnet-${count.index + 1}"
  }
}

# Khởi tạo Internet Gateway - "Cửa ngõ" để VPC có thể kết nối ra Internet
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "${var.project_name}-igw"
  }
}

# Bảng định tuyến (Route Table) cho Public Subnet
resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.main.id

  # Định tuyến mọi truy cập mạng ngoài (0.0.0.0/0) đi qua Internet Gateway
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = {
    Name = "${var.project_name}-public-rt"
  }
}

# Gắn bảng định tuyến (Route Table) ở trên vào TẤT CẢ các Public Subnet đã tạo
resource "aws_route_table_association" "public_rta" {
  count          = length(var.public_subnets_cidr)
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public_rt.id
}
