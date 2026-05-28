#!/bin/bash
# ==========================================
# SCRIPT CÀI ĐẶT TỰ ĐỘNG CHO EC2 (Ubuntu 22.04/24.04)
# ==========================================

echo "1. Tạo Swap 4GB (Cứu cánh cho t2.micro 1GB RAM)..."
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

echo "2. Cập nhật hệ thống..."
sudo apt-get update -y

echo "3. Cài đặt Docker..."
sudo apt-get install -y docker.io
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker ubuntu

echo "4. Cài đặt K3s (Bản K8s siêu nhẹ thay thế Minikube)..."
# t2.micro không đủ cấu hình chạy Minikube, K3s là lựa chọn hoàn hảo nhất!
curl -sfL https://get.k3s.io | sh -
# Cấu hình kubectl cho user ubuntu
mkdir -p ~/.kube
sudo cp /etc/rancher/k3s/k3s.yaml ~/.kube/config
sudo chown -R ubuntu:ubuntu ~/.kube
sudo chmod 600 ~/.kube/config

echo "5. Cài đặt Trivy..."
sudo apt-get install wget apt-transport-https gnupg lsb-release -y
wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | sudo apt-key add -
echo deb https://aquasecurity.github.io/trivy-repo/deb $(lsb_release -sc) main | sudo tee -a /etc/apt/sources.list.d/trivy.list
sudo apt-get update -y
sudo apt-get install trivy -y

echo "6. Cài đặt Java 17 và Jenkins..."
sudo apt-get install fontconfig openjdk-17-jre -y
sudo wget -O /usr/share/keyrings/jenkins-keyring.asc https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key
echo "deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] https://pkg.jenkins.io/debian-stable binary/" | sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null
sudo apt-get update -y
sudo apt-get install jenkins -y

echo "7. Phân quyền cho Jenkins..."
# Cho phép Jenkins dùng Docker
sudo usermod -aG docker jenkins
# Cho phép Jenkins dùng lệnh kubectl
sudo mkdir -p /var/lib/jenkins/.kube
sudo cp /etc/rancher/k3s/k3s.yaml /var/lib/jenkins/.kube/config
sudo chown -R jenkins:jenkins /var/lib/jenkins/.kube
sudo chmod 600 /var/lib/jenkins/.kube/config
# Restart Jenkins để nhận quyền mới
sudo systemctl restart jenkins

echo "=========================================="
echo "CÀI ĐẶT HOÀN TẤT!"
echo "Mật khẩu Admin của Jenkins để đăng nhập lần đầu là:"
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
echo "=========================================="
