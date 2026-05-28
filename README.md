# DevOps Lab 2 - CI/CD Pipeline & Kubernetes

Dự án này là bài Lab tự động hóa toàn bộ quy trình phát triển phần mềm (CI/CD) sử dụng Terraform, GitHub Actions, Jenkins, Docker, SonarQube, Trivy và Kubernetes.

## Cấu trúc thư mục
- `/terraform`: Code Infrastructure as Code (IaC) để tạo mạng VPC và máy ảo EC2 trên AWS.
- `/.github/workflows`: Chứa luồng GitHub Actions để tự động chạy Terraform.
- `/app`: Chứa mã nguồn của Frontend và Backend.
- `/k8s-manifests`: Chứa các file YAML để triển khai ứng dụng lên Kubernetes.
- `Jenkinsfile`: Khai báo luồng CI/CD Pipeline tự động.
- `install-tools.sh`: Script tự động cài đặt toàn bộ môi trường CI/CD trên máy chủ Ubuntu trắng.

---

## 🚀 Quick Start (Hướng dẫn cấu hình nhanh)

### Bước 1: Chuẩn bị máy chủ
Sử dụng một máy tính hoặc máy ảo chạy hệ điều hành **Ubuntu 22.04 hoặc 24.04** (Cần tối thiểu 2GB RAM. Nếu sử dụng EC2 t2.micro, hãy đảm bảo bạn đã tạo Swap và tăng dung lượng ổ cứng lên tối thiểu 20GB).

### Bước 2: Chạy Script cài đặt tự động (One-click Install)
Trên Terminal của máy chủ Ubuntu, cấp quyền thực thi và chạy file cài đặt:
```bash
chmod +x install-tools.sh
./install-tools.sh
```
*Script sẽ tự động cài đặt: Java 21, Docker, K3s (Kubernetes), Trivy, Jenkins và SonarQube.*
Khi script chạy xong, nó sẽ in ra một chuỗi **Mật khẩu Admin** của Jenkins. Hãy copy chuỗi này.

### Bước 3: Cấu hình SonarQube (Quét lỗi code)
1. Truy cập `http://<IP-Máy-Chủ>:9000`
2. Đăng nhập với tài khoản: `admin` / `admin`. (Hệ thống sẽ bắt bạn đổi mật khẩu, lưu ý gõ `admin` vào ô đầu tiên).
3. Vào biểu tượng Avatar góc phải -> **My Account** -> **Security**.
4. Tạo một Token (User Token) và copy mã Token đó.

### Bước 4: Thiết lập Jenkins
1. Truy cập `http://<IP-Máy-Chủ>:8080`.
2. Dán mật khẩu Admin (đã lấy ở Bước 2) vào và chọn "Install suggested plugins".
3. Tạo tài khoản quản trị viên và đăng nhập.
4. **Cài đặt Plugin**: Vào *Manage Jenkins* -> *Plugins* -> Cài đặt 2 plugin là `Docker Pipeline` và `SonarQube Scanner`.
5. **Khai báo Credentials**: Vào *Manage Jenkins* -> *Credentials* -> *System* -> *Global credentials*:
   - Thêm Credential số 1 (Docker Hub): Kind `Username with password`, ID là `docker-hub-creds`. Nhập tài khoản/mật khẩu Docker Hub của bạn.
   - Thêm Credential số 2 (SonarQube): Kind `Secret text`. Dán Token của SonarQube lấy ở Bước 3 vào.
6. **Khai báo Server SonarQube**: Vào *Manage Jenkins* -> *System* -> Kéo xuống phần *SonarQube servers*. Tên là `SonarQube`, URL là `http://<IP-Máy-Chủ>:9000` và chọn Credential số 2.
7. **Cấu hình Sonar Scanner**: Vào *Manage Jenkins* -> *Tools* -> Kéo xuống *SonarQube Scanner* -> Chọn "Install automatically".

### Bước 5: Chạy Pipeline 
1. Quay lại trang chủ Jenkins, bấm **New Item** -> Nhập tên (ví dụ: `my-app-pipeline`) -> Chọn **Pipeline**.
2. Ở mục **Pipeline**, phần *Definition* chọn `Pipeline script from SCM`.
3. SCM chọn `Git` và dán URL kho GitHub của bạn vào.
4. Bấm Save và nhấn **Build Now**.
5. Tận hưởng thành quả! Pipeline sẽ tự động Build, Test, Quét bảo mật và Deploy lên Kubernetes!

### Lệnh hữu ích kiểm tra Kubernetes sau khi Deploy
```bash
kubectl get pods
kubectl get services
```
