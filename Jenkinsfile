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

        sh 'chmod 644 .env'
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
    stage('Deploy HOMOLOG') {
      when { environment name: 'DEPLOY_TO', value: 'homolog' }
      environment {
        htdocs = "/var/www/manager-client"
      }
      steps {
        sh "mkdir -p ${env.htdocs}/${env.BUILD_NUMBER}"
        sh "tar -zxf build.${env.BUILD_NUMBER}.tar.gz -C ${env.htdocs}/${env.BUILD_NUMBER}"
        sh "psy rm manager"
        sh "psy start -n manager -- ${env.htdocs}/${env.BUILD_NUMBER}/bin/cmd.js"
        sh "psy ls"
        sh "rm ${env.htdocs}/assets && ln -s ${env.htdocs}/${env.BUILD_NUMBER}/public ${env.htdocs}/assets"
      }
    }
  }
  post {
    failure {
      slackSend channel: '#general',
        color: 'RED',
        message: "Pipeline ${currentBuild.fullDisplayName} @ ${env.TETRIS_ENV} failed to build; check 'em ${env.BUILD_URL}"
    }
    success {
      slackSend channel: '#general',
        color: 'good',
        message: "Finished building ${currentBuild.fullDisplayName} @ ${env.TETRIS_ENV}; check 'em ${env.BUILD_URL}"
    }
    always {
      echo 'The End'
      deleteDir()
    }
  }
}
