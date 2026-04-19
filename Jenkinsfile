pipeline {
    agent any

    stages {

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t pet-app .'
            }
        }

        stage('Run Container') {
            steps {
                sh '''
                docker stop pet-container || true
                docker rm pet-container || true
                docker run -d -p 5000:5000 --name pet-container pet-app
                '''
            }
        }
    }
}
