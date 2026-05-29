#!/bin/bash
# ==========================================
# SCRIPT CÀI ĐẶT TỰ ĐỘNG MÔI TRƯỜNG CI/CD (Ubuntu 22.04/24.04)
# Jenkins (Native) + K3s + Docker + Trivy + SonarQube (Docker)
# ==========================================

echo "1. Cập nhật hệ thống và cài đặt Java 21..."
sudo apt-get update -y
sudo apt-get install -y ca-certificates curl gnupg lsb-release wget apt-transport-https fontconfig openjdk-21-jre

echo "2. Xóa Docker cũ (tránh xung đột) và cài Docker bản chuẩn..."
sudo apt-get remove -y docker docker-engine docker.io containerd runc
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

echo "3. Cài đặt K3s (Kubernetes siêu nhẹ)..."
curl -sfL https://get.k3s.io | sh -
mkdir -p ~/.kube
sudo cp /etc/rancher/k3s/k3s.yaml ~/.kube/config
sudo chown -R $USER:$USER ~/.kube
sudo chmod 600 ~/.kube/config

echo "4. Cài đặt Trivy..."
wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | sudo gpg --dearmor --yes -o /usr/share/keyrings/trivy-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/trivy-archive-keyring.gpg] https://aquasecurity.github.io/trivy-repo/deb $(lsb_release -sc) main" | sudo tee /etc/apt/sources.list.d/trivy.list
sudo apt-get update -y
sudo apt-get install -y trivy

echo "5. Cài đặt Jenkins (Tự động tải GPG Key mới nhất)..."
sudo gpg --keyserver keyserver.ubuntu.com --recv-keys 7198F4B714ABFC68
sudo gpg --export 7198F4B714ABFC68 | sudo tee /etc/apt/trusted.gpg.d/jenkins.gpg > /dev/null
echo "deb https://pkg.jenkins.io/debian-stable binary/" | sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null
sudo apt-get update -y
sudo apt-get install -y jenkins
sudo systemctl enable jenkins
sudo systemctl start jenkins

echo "6. Phân quyền cho Jenkins dùng Docker và K8s..."
sudo usermod -aG docker jenkins
sudo mkdir -p /var/lib/jenkins/.kube
sudo cp /etc/rancher/k3s/k3s.yaml /var/lib/jenkins/.kube/config
sudo chown -R jenkins:jenkins /var/lib/jenkins/.kube
sudo chmod 600 /var/lib/jenkins/.kube/config
sudo systemctl restart jenkins

echo "7. Khởi chạy SonarQube bằng Docker..."
sudo sysctl -w vm.max_map_count=262144
sudo docker run -d --name sonarqube -e SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true -p 9000:9000 sonarqube:lts-community

echo "8. Khởi tạo K8s Namespace..."
sudo kubectl create namespace devops-dev || true

echo "=========================================="
echo "CÀI ĐẶT HOÀN TẤT!"
echo "Đang đợi Jenkins khởi động (15s)..."
sleep 15
echo "Mật khẩu Admin của Jenkins để đăng nhập lần đầu là:"
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
echo "=========================================="
