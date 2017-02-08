pipeline {
    agent any

    stages {
        stage('Checkout') {
          yarn
        }
        stage('Build') {
            steps {
                sh 'npm run bundle'
            }
        }
        stage('Test') {
            steps {
                echo 'Testing... jk'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying....'
            }
        }
    }
}
