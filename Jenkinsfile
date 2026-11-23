
pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'ruksar786dev/freshcart'
        DOCKER_TAG = 'latest'
        K8S_DEPLOYMENT = 'freshcart'
        K8S_CONTAINER = 'freshcart'
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Checking FreshCart source code'
                bat 'git --version'
                bat 'dir'
            }
        }

        stage('Docker Build') {
            steps {
                echo 'Building FreshCart Docker Image'
                bat 'docker build -t %DOCKER_IMAGE%:%DOCKER_TAG% .'
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-creds',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )
                ]) {
                    bat '''
                        @echo off
                        echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin
                    '''
                }
            }
        }

        stage('Docker Push') {
            steps {
                echo 'Pushing FreshCart image to Docker Hub'
                bat 'docker push %DOCKER_IMAGE%:%DOCKER_TAG%'
            }
        }

        stage('Kubernetes Deploy') {
            steps {
                echo 'Deploying FreshCart to Kubernetes'

                bat '''
                    kubectl set image deployment/%K8S_DEPLOYMENT% %K8S_CONTAINER%=%DOCKER_IMAGE%:%DOCKER_TAG%
                    kubectl rollout status deployment/%K8S_DEPLOYMENT% --timeout=120s
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                bat 'kubectl get deployments'
                bat 'kubectl get pods'
                bat 'kubectl get services'
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
