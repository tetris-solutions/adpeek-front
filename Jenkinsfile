pipeline {
  agent any
  environment {
    svc_name = 'manager'
    htdocs = "/var/www/manager-client"
    production_env = credentials('production.env')
    homolog_env = credentials('homolog.env')
    ssh_key = credentials('tetris.pem')
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
        sh 'npm install'
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
        sh 'npm install --production'
        sh "tar -zcf build.${env.BUILD_NUMBER}.tar.gz .env package.json npm-shrinkwrap.json bin lib public node_modules"
        archive "build.${env.BUILD_NUMBER}.tar.gz"
      }
    }
    stage('Deploy') {
      steps {
        sh "cp ${env.ssh_key} tetris.pem"
        sh "chmod 600 tetris.pem"
        sh "scp -i tetris.pem -o StrictHostKeyChecking=no build.${env.BUILD_NUMBER}.tar.gz ubuntu@${env.DEPLOY_TO}:."
        sh "ssh -i tetris.pem -o StrictHostKeyChecking=no -t ubuntu@${env.DEPLOY_TO} 'mkdir -p ${env.htdocs}/${env.BUILD_NUMBER}'"
        sh "ssh -i tetris.pem -o StrictHostKeyChecking=no -t ubuntu@${env.DEPLOY_TO} 'tar -zxf build.${env.BUILD_NUMBER}.tar.gz -C ${env.htdocs}/${env.BUILD_NUMBER}'"
        sh "ssh -i tetris.pem -o StrictHostKeyChecking=no -t ubuntu@${env.DEPLOY_TO} 'rm build.${env.BUILD_NUMBER}.tar.gz'"

        sh "ssh -i tetris.pem -o StrictHostKeyChecking=no -t ubuntu@${env.DEPLOY_TO} 'ln -fs ${env.htdocs}/${env.BUILD_NUMBER} ${env.htdocs}/latest'"
        sh "ssh -i tetris.pem -o StrictHostKeyChecking=no -t ubuntu@${env.DEPLOY_TO} 'sudo ln -fs ${env.htdocs}/latest/bin/cmd.js' /usr/bin/${env.svc_name}"

        sh "ssh -i tetris.pem -o StrictHostKeyChecking=no -t ubuntu@${env.DEPLOY_TO} 'pm2 delete ${env.svc_name} || true'"
        sh "ssh -i tetris.pem -o StrictHostKeyChecking=no -t ubuntu@${env.DEPLOY_TO} 'pm2 start ${env.svc_name}'"
      }
    }
  }
  post {
    failure {
      slackSend channel: '#ops',
        color: 'RED',
        message: "Oops! ${currentBuild.fullDisplayName} failed to build for ${env.TETRIS_ENV}: ${env.BUILD_URL}"
    }
    success {
      slackSend channel: '#ops',
        color: 'good',
        message: "THIS JUST IN... ${currentBuild.fullDisplayName} built for ${env.TETRIS_ENV}, deployed to ${env.DEPLOY_TO}: ${env.BUILD_URL}"
    }
    always {
      echo 'The End'
      deleteDir()
    }
  }
}
