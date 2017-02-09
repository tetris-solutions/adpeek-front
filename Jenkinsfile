pipeline {
  agent any
  environment {
    production_env = credentials('production.env')
    homolog_env = credentials('homolog.env')
  }
  stages {
    stage('Provision') {
      steps {
        script {
          if (env.TETRIS_ENV == 'homolog') {
            sh "cp ${env.homolog_env} .env"
          } else {
            sh "cp ${env.production_env} .env"
          }
        }

        sh 'chmod 640 .env'
      }
    }
    stage('Build') {
      steps {
        sh 'yarn'
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
        sh "tar -zcf build.${env.BUILD_NUMBER}.tar.gz .env package.json bin lib public node_modules"
        archive "build.${env.BUILD_NUMBER}.tar.gz"
      }
    }
    stage('Deploy') {
      steps {
        echo 'Deploying....'
        sh "mkdir -p /var/www/manager-client/${env.BUILD_NUMBER}"
        sh "tar -zxf build.${env.BUILD_NUMBER}.tar.gz -C /var/www/manager-client/${env.BUILD_NUMBER}"
      }
    }
  }
  post {
    failure {
      slackSend channel: '#general',
        color: 'red',
        message: "Pipeline ${currentBuild.fullDisplayName} @ ${env.TETRIS_ENV} failed to build; check 'em ${env.BUILD_URL}"
    }
    success {
      slackSend channel: '#general',
        color: 'green',
        message: "Finished building ${currentBuild.fullDisplayName} @ ${env.TETRIS_ENV}; check 'em ${env.BUILD_URL}"
    }
    always {
      echo 'The End'
      deleteDir()
    }
  }
}
