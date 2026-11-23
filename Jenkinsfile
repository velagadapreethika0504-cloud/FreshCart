
pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'ruksar786dev/freshcart'
        DOCKER_TAG = 'latest'
        K8S_DEPLOYMENT = 'freshcart'
        K8S_CONTAINER = 'freshcart'

        DOCKER_PATH = 'C:\\Users\\PREETHIKA\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin\\docker.exe'
        KUBECTL_PATH = 'C:\\Users\\PREETHIKA\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin\\kubectl.exe'
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'FreshCart Git Checkout Successful'
                bat 'git --version'
                bat 'dir'
            }
        }

        stage('Docker Check') {
            steps {
                echo 'Checking Docker'
                bat '"%DOCKER_PATH%" --version'
            }
        }

        stage('Docker Build') {
            steps {
                echo 'Building FreshCart Docker Image'

                bat '''
                    "%DOCKER_PATH%" build -t %DOCKER_IMAGE%:%DOCKER_TAG% .
                '''
            }
        }

        stage('Docker Login') {
            steps {
                echo 'Logging into Docker Hub'

                withCredentials([
                    string(
                        credentialsId: 'dockerhub-token',
                        variable: 'DOCKER_PASS'
                    )
                ]) {
                    bat '''
                        powershell -NoProfile -NonInteractive -Command "$env:DOCKER_PASS | & '%DOCKER_PATH%' login -u 'ruksar786dev' --password-stdin"
                    '''
                }
            }
        }

        stage('Docker Push') {
            steps {
                echo 'Pushing FreshCart Image to Docker Hub'

                bat '''
                    "%DOCKER_PATH%" push %DOCKER_IMAGE%:%DOCKER_TAG%
                '''
            }
        }

        stage('Kubernetes Deploy') {
            steps {
                echo 'Deploying FreshCart to Kubernetes'

                bat '''
                    "%KUBECTL_PATH%" set image deployment/%K8S_DEPLOYMENT% %K8S_CONTAINER%=%DOCKER_IMAGE%:%DOCKER_TAG%

                    "%KUBECTL_PATH%" rollout status deployment/%K8S_DEPLOYMENT% --timeout=120s
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                echo 'Verifying Kubernetes Deployment'

                bat '''
                    "%KUBECTL_PATH%" get deployments
                    "%KUBECTL_PATH%" get pods
                    "%KUBECTL_PATH%" get services
                '''
            }
        }
    }

    post {
        success {
            echo 'SUCCESS: FreshCart CI/CD Pipeline Completed!'
        }

        failure {
            echo 'ERROR: FreshCart CI/CD Pipeline Failed!'
        }

        always {
            echo 'FreshCart Pipeline Execution Finished'
        }
    }
}
