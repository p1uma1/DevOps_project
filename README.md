## 🚀 CI/CD Pipeline (Jenkins + Docker + EC2)

This project uses a fully automated CI/CD pipeline hosted on an AWS EC2 instance. Here's how it works:

1. **GitHub Integration**: When code is pushed to a specified branch, a webhook triggers a Jenkins job.
2. **Jenkins on EC2**: Jenkins (running on EC2 with extended memory + swap space) clones the repository.
3. **Build & Push Docker Images**: Jenkins builds Docker images for both backend and frontend using the `BUILD_NUMBER` as the tag. These images are then pushed to [DockerHub](https://hub.docker.com/u/k4sund).
4. **Container Deployment**: After pushing, Jenkins pulls the latest images and runs `docker-compose` to deploy the application in containers.

🔧 The Jenkins pipeline is currently managed directly on the EC2 instance (not part of this repo), but you can find the pipeline structure below:

<details>
  <summary>Click to view Jenkins Pipeline Script</summary>

```groovy
pipeline {
    agent any
    environment {
        DOCKERHUB_USER = "p1uma1"
        // Using your image names but with your DockerHub username
        BACKEND_IMAGE = "${DOCKERHUB_USER}/backend"
        FRONTEND_IMAGE = "${DOCKERHUB_USER}/frontend"
    }
    stages {
        stage('Checkout GitHub') {
            steps {
                checkout scmGit(
                    branches: [[name: '*/jenkins']],
                    extensions: [],
                    userRemoteConfigs: [[url: 'https://github.com/p1uma1/DevOps_project.git']]
                )
            }
        }
        stage('Create Backend .env') {
            steps {
                writeFile file: 'backend/.env', text: '''POSTGRES_USER=myuser
                POSTGRES_PASSWORD=mypassword
                POSTGRES_DB=mydatabase
                SPRING_DATASOURCE_URL=jdbc:postgresql://database:5432/mydatabase
                SPRING_DATASOURCE_USERNAME=myuser
                SPRING_DATASOURCE_PASSWORD=mypassword
                SPRING_JPA_HIBERNATE_DDL_AUTO=update
                SPRING_JPA_SHOW_SQL=true
                SERVER_PORT=5000'''
                echo "✅ Backend .env file created!"
            }
        }
        stage('Create Frontend .env') {
            steps {
                writeFile file: 'frontend/.env', text: '''REACT_APP_RAPID_API_KEY=
                        REACT_APP_RAPID_API_HOST=
                        REACT_APP_API_BASE_URL=http://{instance ip use here}:5000
                    '''
                echo "✅ Frontend .env file created!"
            }
        }
        stage('Login to Docker Hub') {
            steps {
                script {
                    withCredentials([string(credentialsId: 'dockerhub-credentials', variable: 'DOCKERHUB_PASSWORD')]) {
                        sh "echo ${DOCKERHUB_PASSWORD} | docker login -u ${DOCKERHUB_USER} --password-stdin"
                    }
                }
            }
        }
        stage('Build and Push Docker Images') {
            steps {
                script {
                    // Build and tag backend image
                    sh "docker build -t ${BACKEND_IMAGE}:${env.BUILD_NUMBER} -t ${BACKEND_IMAGE}:latest ./backend"
                    // Build and tag frontend image
                    sh "docker build -t ${FRONTEND_IMAGE}:${env.BUILD_NUMBER} -t ${FRONTEND_IMAGE}:latest ./frontend"
                    
                    // Push all images to DockerHub
                    sh "docker push ${BACKEND_IMAGE}:${env.BUILD_NUMBER}"
                    sh "docker push ${BACKEND_IMAGE}:latest"
                    sh "docker push ${FRONTEND_IMAGE}:${env.BUILD_NUMBER}"
                    sh "docker push ${FRONTEND_IMAGE}:latest"
                    
                    echo "✅ Docker images built and pushed to Docker Hub!"
                }
            }
        }
        stage('Deploy with Docker Compose') {
            steps {
                script {
                                      
                    // Deploy the application
                    sh "docker-compose down --remove-orphans"
                    sh "docker-compose up -d"
                    sh "docker ps"  // Verify running containers
                }
            }
        }
        stage('Clean Up') {
            steps {
                script {
                    sh "docker image prune -f"  // Removes unused Docker images
                }
            }
        }
    }
    post {
        always {
            echo "✅ Pipeline execution complete! Check Docker logs if needed."
        }
        failure {
            script {
                echo "⚠️ Pipeline failed! Printing logs..."
                sh "docker-compose logs"
            }
        }
    }
}
