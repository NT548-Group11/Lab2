# DevOps Lab 2 - Môn Học NT548 (Tổ hợp câu hỏi)

Tài liệu này hướng dẫn chi tiết (End-to-End) cách triển khai các câu hỏi thực hành trong Lab 2, bao gồm việc xây dựng hạ tầng với Terraform và cấu hình luồng CI/CD Pipeline với Jenkins, SonarQube, Trivy, và Kubernetes (K3s).

---

## CÂU 1: Triển khai hạ tầng cơ sở (Infrastructure as Code) với Terraform & GitHub Actions

### 1.1 Hướng dẫn cài đặt môi trường (Thiết lập AWS OIDC & GitHub Secrets)
Để GitHub Actions có quyền tự động chạy Terraform và tạo tài nguyên trên AWS mà không cần lộ Access Key (Best Practice), bạn cần thiết lập OIDC:
1. Đăng nhập vào [AWS Console](https://aws.amazon.com/console/) -> Truy cập dịch vụ **IAM**.
2. Ở menu trái, chọn **Identity providers** -> **Add provider**:
   - Loại: `OpenID Connect`
   - Provider URL: `https://token.actions.githubusercontent.com`
   - Audience: `sts.amazonaws.com`
3. Tạo một **IAM Role** gán với Provider vừa tạo, đính kèm quyền `AdministratorAccess` (hoặc quyền giới hạn cho EC2/VPC).
4. Lấy đoạn mã **ARN** của IAM Role đó (Ví dụ: `arn:aws:iam::123456789012:role/GitHubActionsRole`).
5. Truy cập dịch vụ **EC2** trên AWS -> Chọn **Key Pairs** -> **Create key pair** -> Nhập tên `devops-lab2-key` và tải file `.pem` về máy để sử dụng cho việc SSH sau này.
6. Vào kho code của bạn trên GitHub -> **Settings** -> **Secrets and variables** -> **Actions** -> Tạo một Repository Secret mới:
   - Tên: `AWS_ROLE_ARN_TERRAFORM`
   - Value: Điền mã ARN vừa copy vào.

### 1.2 Cách chạy mã nguồn (Kích hoạt luồng CI/CD)
Luồng GitHub Actions (được định nghĩa trong file `.github/workflows/terraform.yml`) sẽ tự động được kích hoạt khi có thay đổi trong thư mục `terraform/`.
1. Trên máy tính của bạn, chỉnh sửa bất kỳ file `.tf` nào trong thư mục `terraform/environments/dev/` (Ví dụ: đảm bảo cấu hình EC2 sử dụng key_name `devops-lab2-key` vừa tạo).
2. Lưu file, Commit và Push code lên nhánh `main`:
   ```bash
   git add terraform/
   git commit -m "Trigger Terraform deployment via GitHub Actions"
   git push origin main
   ```
3. Lên giao diện kho code trên GitHub, chuyển sang tab **Actions**.
4. Bạn sẽ thấy luồng **Terraform CI/CD** đang tự động chạy. Nó sẽ trải qua 2 bước:
   - **Checkov Security Scan**: Quét mã nguồn Terraform để tìm các lỗ hổng bảo mật.
   - **Terraform Plan & Apply**: Tự động xác thực với AWS thông qua OIDC và áp dụng triển khai.

### 1.3 Cách kiểm tra kết quả triển khai
1. Kiểm tra log của GitHub Actions: Nhấp vào luồng đang chạy để xem chi tiết Output của lệnh `terraform apply`. Đảm bảo nó báo thành công `Apply complete! Resources: X added...`
2. Đăng nhập vào [AWS Management Console](https://aws.amazon.com/console/).
3. Điều hướng tới dịch vụ **EC2**: Kiểm tra xem máy chủ ảo có tên `devops-lab2-web-instance` đã ở trạng thái *Running* và đã được gán Key pair `devops-lab2-key` hay chưa.
4. Điều hướng tới dịch vụ **VPC**: Kiểm tra hệ thống mạng ảo, Subnet và Internet Gateway đã được cấp phát đúng cấu hình mà Terraform định nghĩa chưa.
5. (Tuỳ chọn) Sử dụng file `devops-lab2-key.pem` đã tải về để SSH trực tiếp vào máy chủ EC2 kiểm tra.

---

## CÂU 2:


---

## CÂU 3: Xây dựng luồng CI/CD Pipeline (Jenkins, SonarQube, Trivy, Kubernetes)

### 3.1 Hướng dẫn cài đặt môi trường
Phần này yêu cầu một máy chủ/máy ảo sử dụng hệ điều hành **Ubuntu (22.04 / 24.04)**. Để tiết kiệm thời gian, một Script cài đặt tự động đã được viết sẵn.

1. Tại máy chủ Ubuntu, cấp quyền và chạy file cài đặt tự động:
   ```bash
   chmod +x install-tools.sh
   bash install-tools.sh
   ```
   *(Script này sẽ tự động cài đặt: Java 21, Docker, Cụm Kubernetes K3s, Khởi tạo Namespace K8s, Máy quét bảo mật Trivy, và Jenkins).*
2. Lưu lại chuỗi **Mật khẩu khởi tạo Admin** của Jenkins được in ra ở cuối màn hình Terminal.
3. SonarQube cũng đã được tự động chạy ở Port 9000 bởi Script trên.

### 3.2 Cách cấu hình và chạy mã nguồn Pipeline
**A. Thiết lập SonarQube**
1. Truy cập `http://<IP-Ubuntu>:9000` (Tài khoản mặc định: `admin` / `admin`). Đổi mật khẩu mới.
2. Vào biểu tượng Avatar góc phải -> **My Account** -> **Security** -> Tạo và copy một mã **Token**.

**B. Thiết lập Jenkins**
1. Truy cập `http://<IP-Ubuntu>:8080`, dán mật khẩu Admin đã lấy ở bước cài đặt để mở khóa.
2. Cài đặt các Plugin bắt buộc: Vào *Manage Jenkins* -> *Plugins* -> Cài đặt `Docker Pipeline` và `SonarQube Scanner`.
3. Lưu Credentials: Vào *Manage Jenkins* -> *Credentials*.
   - Khai báo tài khoản Docker Hub của bạn (Loại `Username with password`, ID bắt buộc là: `docker-hub-creds`).
   - Khai báo Token của SonarQube (Loại `Secret text`).
4. Kết nối Jenkins với SonarQube: 
   - Vào *Manage Jenkins* -> *System* -> Kéo xuống *SonarQube servers*. Đặt tên là `SonarQube`, URL là `http://172.17.0.1:9000` (hoặc IP của máy Ubuntu) và chọn Credential Token vừa tạo.
   - Vào *Manage Jenkins* -> *Tools* -> Kéo xuống *SonarQube Scanner installations*. Đặt tên là `sonar-scanner` và đánh dấu *Install automatically*.

**C. Chạy mã nguồn (Kích hoạt Pipeline)**
1. Tại trang chủ Jenkins, bấm **New Item** -> Nhập tên Job (VD: `lab2-pipeline`) -> Chọn loại **Pipeline**.
2. Cuộn xuống phần *Pipeline Definition*, chọn `Pipeline script from SCM`.
3. Chọn SCM là `Git` và dán đường dẫn URL kho GitHub của bạn vào.
4. Ở mục Branch Specifier, sửa đổi thành `*/main` (hoặc nhánh tương ứng của bạn).
5. Kéo lên mục *Build Triggers*, chọn `Poll SCM` và điền `* * * * *` (Để Jenkins tự động kiểm tra code mới mỗi phút).
6. Bấm **Save** và nhấn **Build Now** để khởi chạy lần đầu tiên.

### 3.3 Cách kiểm tra kết quả triển khai
Quy trình Pipeline thành công khi Jenkins báo tích xanh tất cả các Stage: Checkout -> Build -> Push -> SonarQube -> Trivy -> Deploy. Quá trình triển khai lên Kubernetes (K3s) được thực hiện bởi Jenkins.

1. **Kiểm tra Quality Gate (SonarQube):** 
   - Truy cập lại `http://<IP-Ubuntu>:9000`. Bạn sẽ thấy dự án đã được phân tích. Kiểm tra các mục Bugs, Vulnerabilities và Code Smells.
2. **Kiểm tra Image (Trivy & DockerHub):**
   - Log của Jenkins sẽ hiển thị kết quả rà soát lỗi bảo mật của Trivy. Nếu không có lỗi `CRITICAL`, Pipeline sẽ cho qua.
   - Lên trang web Docker Hub cá nhân, kiểm tra xem Image đã được đẩy lên với các tag phiên bản mới nhất hay chưa.
3. **Kiểm tra Triển khai (Kubernetes - K3s):**
   - Mở Terminal trên Ubuntu, xác nhận Pods đang chạy ổn định:
     ```bash
     kubectl get pods -n devops-dev
     kubectl get svc -n devops-dev
     ```
   - Mở trình duyệt và truy cập vào IP của Cluster (Cổng của NodePort hoặc LoadBalancer) để xem giao diện Website đã hoạt động.
