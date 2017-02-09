pipeline {
  agent any
  environment {
    production_env = credentials('prod.env')
    homolog_env = credentials('homolog.env')
  }
  stages {
    stage('Provisioning HOMOLOG') {
      when { environment name: 'TETRIS_ENV', value: 'homolog' }
      steps {
        sh "cp ${env.homolog_env} .env"
      }
    }
    stage('Provisioning PRODUCTION') {
      when { environment name: 'TETRIS_ENV', value: 'production' }
      steps {
        sh "cp ${env.production_env} .env"
      }
    }
    stage('Checkout') {
      steps {
        sh 'yarn'
      }
    }
    stage('Build') {
      when { environment name: 'TETRIS_ENV', value: 'homolog' }
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
