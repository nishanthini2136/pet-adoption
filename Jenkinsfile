pipeline {
    agent any

    stages {

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t pet-adoption-app .'
            }
        }

        stage('Run Container Test') {
            steps {
                sh '''
                docker stop test || true
                docker rm test || true
                docker run -d -p 5000:5000 --name test pet-adoption-app
                sleep 10
                curl http://localhost:5000
                docker stop test
                docker rm test
                '''
            }
        }
    }
}