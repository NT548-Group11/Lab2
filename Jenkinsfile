pipeline {
    agent any

    environment {
        // Lấy thông tin đăng nhập Docker Hub đã cấu hình trên Jenkins
        DOCKER_CREDENTIALS = credentials('docker-hub-creds')
        FRONTEND_IMAGE_NAME = 'hmdat1706/nt548-frontend'
        BACKEND_IMAGE_NAME = 'hmdat1706/nt548-backend'
        IMAGE_TAG = "v${env.BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage("Build Docker Images") {
            steps {
                echo "Building the Docker images..."
                script {
                    docker.build("${env.FRONTEND_IMAGE_NAME}:${env.IMAGE_TAG}", "./app/frontend")
                    docker.build("${env.BACKEND_IMAGE_NAME}:${env.IMAGE_TAG}", "./app/backend")
                }
            }
        }

        stage("Push Docker Images") {
            steps {
                echo "Pushing images to DockerHub..."
                script {
                    docker.withRegistry("https://index.docker.io/v1/", "docker-hub-creds") {
                        docker.image("${env.FRONTEND_IMAGE_NAME}:${env.IMAGE_TAG}").push()
                        docker.image("${env.BACKEND_IMAGE_NAME}:${env.IMAGE_TAG}").push()
                    }
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                echo "Code quality scan with SonarQube..."
                withSonarQubeEnv('SonarQube') {
                    sh "sonar-scanner"
                }
            }
        }

        stage('Trivy Security Scan') {
            steps {
                echo "Images vulnerability scan with Trivy..."
                script {
                    trivy image --exit-code 1 --severity HIGH,CRITICAL "${env.FRONTEND_IMAGE_NAME}:${env.IMAGE_TAG}"
                    trivy image --exit-code 1 --severity HIGH,CRITICAL "${env.BACKEND_IMAGE_NAME}:${env.IMAGE_TAG}"
                }
            }
        }

        stage("Deploy") {
            steps {
                echo "Deploy new image to K8s..."
                script {
                    sh "sed -i 's|hmdat1706/nt548-frontend:${old_tag}|${env.FRONTEND_IMAGE_NAME}:${env.IMAGE_TAG}|g' ./k8s/frontend-deployment.yaml"
                    sh "sed -i 's|hmdat1706/nt548-backend:${old_tag}|${env.BACKEND_IMAGE_NAME}:${env.IMAGE_TAG}|g' ./k8s/backend-deployment.yaml"
                    sh "kubectl apply -f ./k8s/"
            }
        }
    }
}