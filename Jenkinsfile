pipeline {
  agent any
  environment {
    production_env = credentials('production.env')
    homolog_env = credentials('homolog.env')
  }
  stages {
    stage('Provisioning') {
      steps {
        script {
          if (env.TETRIS_ENV == 'homolog') {
            sh "cp ${env.homolog_env} .env"
          } else {
            sh "cp ${env.production_env} .env"
          }
        }

        sh 'chmod 600 .env'
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
      }
    }
    stage('Test') {
      steps {
        echo 'Testing... jk'
      }
    }
    stage ('Archive') {
      steps {
        sh 'rm -rf node_modules'
        sh 'yarn install --production'
        sh 'tar -zcvf build.tar.gz .env package.json bin lib public node_modules'
      }
    }
    stage('Deploy') {
      steps {
        echo 'Deploying....'
      }
    }
  }
}
