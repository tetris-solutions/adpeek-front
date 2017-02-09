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

        sh 'chmod 600 .env'
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
        sh 'tar -zcf build.tar.gz .env package.json bin lib public node_modules'
        archive 'build.tar.gz'
      }
    }
    stage('Deploy') {
      steps {
        echo 'Deploying....'
        sh "mkdir -p /var/www/manager-client/${env.BUILD_TIMESTAMP}"
        sh "tar -zxf build.tar.gz -C /var/www/manager-client/${env.BUILD_TIMESTAMP}"
      }
    }
  }
  post {
    failure {
      slackSend channel: '#general',
        color: 'RED',
        message: "Pipeline ${currentBuild.fullDisplayName} @ ${env.TETRIS_ENV} failed to build."
    }
    success {
      slackSend channel: '#general',
        color: 'good',
        message: "Finished building ${currentBuild.fullDisplayName} @ ${env.TETRIS_ENV}."
    }
    always {
      echo 'The End'
      deleteDir()
    }
  }
}
