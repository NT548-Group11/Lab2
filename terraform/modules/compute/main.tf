resource "aws_security_group" "web_sg" {
  #checkov:skip=CKV_AWS_382: Lab environment requires outbound internet
  #checkov:skip=CKV_AWS_24: Lab environment requires public SSH access
  #checkov:skip=CKV_AWS_260: Lab environment requires public HTTP access
  name        = "${var.project_name}-web-sg"
  description = "Security Group for Web Server"
  vpc_id      = var.vpc_id

  ingress {
    description = "Allow SSH access from anywhere"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Allow HTTP access from anywhere"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-web-sg"
  }
}

resource "aws_instance" "web" {
  #checkov:skip=CKV2_AWS_41: IAM role is not required for this basic lab
  #checkov:skip=CKV_AWS_135: EBS optimization is not supported on t2.micro
  ami                    = var.ami_id
  instance_type          = var.instance_type
  subnet_id              = var.subnet_id
  vpc_security_group_ids = [aws_security_group.web_sg.id]
  key_name               = var.key_name

  monitoring = true

  root_block_device {
    encrypted = true
  }

  metadata_options {
    http_tokens = "required"
  }

  tags = {
    Name = "${var.project_name}-web-instance"
  }
}