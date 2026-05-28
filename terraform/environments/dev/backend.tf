terraform {
  backend "s3" {
    bucket  = "devops-lab2-tfstate-hmdat1706" 
    
    key     = "dev/terraform.tfstate" # Đường dẫn lưu file bên trong bucket
    region  = "us-east-1"             # Cùng region với hạ tầng
    encrypt = true                    # Mã hóa file để bảo mật an toàn
  }
}
