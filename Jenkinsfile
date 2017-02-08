pipeline {
    agent any

    stages {
        stage('Checkout') {
          steps {
            sh 'yarn'
          }
        }
        stage('Build') {
            steps {
                sh 'npm run bundle'
                sh 'tar -zcvf build.tar.gz lib public/js/*client*'
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
