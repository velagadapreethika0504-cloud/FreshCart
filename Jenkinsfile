
pipeline {
    agent any

    environment {
        DOCKER_PATH = 'C:/Users/PREETHIKA/AppData/Local/Programs/DockerDesktop/resources/bin/docker.exe'
        KUBECTL_PATH = 'C:/Users/PREETHIKA/AppData/Local/Programs/DockerDesktop/resources/bin/kubectl.exe'
        DOCKER_IMAGE = 'ruksar786dev/freshcart:latest'
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
                bat '"%DOCKER_PATH%" build -t %DOCKER_IMAGE% .'
            }
        }

        stage('Docker Login') {
            steps {
                echo 'Logging into Docker Hub'

                withCredentials([usernamePassword(
                    credentialsId: 'freshcart-docker-login',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    bat '''
                        @echo off
                        if not defined DOCKER_PASS (
                            echo ERROR: Docker password is empty
                            exit /b 1
                        )
                        echo %DOCKER_PASS% | "%DOCKER_PATH%" login -u "%DOCKER_USER%" --password-stdin
                    '''
                }
            }
        }

        stage('Docker Push') {
            steps {
                echo 'Pushing FreshCart Image to Docker Hub'
                bat '"%DOCKER_PATH%" push %DOCKER_IMAGE%'
            }
        }

        stage('Kubernetes Deploy') {
            steps {
                echo 'Deploying FreshCart to Kubernetes'

                bat '''
                    "%KUBECTL_PATH%" set image deployment/freshcart freshcart=%DOCKER_IMAGE%
                    "%KUBECTL_PATH%" rollout status deployment/freshcart --timeout=120s
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                echo 'Checking Kubernetes Deployment'

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
            echo 'FreshCart CI/CD Pipeline Executed Successfully!'
        }

        failure {
            echo 'ERROR: FreshCart CI/CD Pipeline Failed!'
        }

        always {
            echo 'FreshCart Pipeline Execution Finished'
        }
    }
}
