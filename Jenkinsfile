pipeline {
    agent any

    environment {
        IMAGE_NAME = "pet-adoption-app"
        CONTAINER_NAME = "pet-test"
        PORT = "5000"
    }

    stages {

        stage('Clean Workspace') {
            steps {
                deleteDir()
            }
        }

        stage('Clone Code') {
            steps {
                git branch: 'main', url: 'https://github.com/nishanthini2136/pet-adoption.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                echo "Installing dependencies..."
                npm install
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                echo "Building Docker image..."
                docker build -t $IMAGE_NAME .
                '''
            }
        }

        stage('Run Container Test') {
            steps {
                sh '''
                echo "Stopping old container if exists..."
                docker stop $CONTAINER_NAME || true
                docker rm $CONTAINER_NAME || true

                echo "Running new container..."
                docker run -d -p $PORT:$PORT --name $CONTAINER_NAME $IMAGE_NAME

                echo "Waiting for app to start..."
                sleep 10

                echo "Testing application..."
                curl http://localhost:$PORT || exit 1

                echo "Cleaning up..."
                docker stop $CONTAINER_NAME
                docker rm $CONTAINER_NAME
                '''
            }
        }
    }

    post {
        success {
            echo "✅ Build Successful!"
        }
        failure {
            echo "❌ Build Failed!"
        }
    }
}