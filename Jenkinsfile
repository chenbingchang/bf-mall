pipeline {
    agent { docker 'node:12.10' }
    stages {
        stage('build') {
            steps {
              // unix使用sh;window使用bat
                bat 'npm i'
                bat '安装依赖完成'
                bat 'npm run build'
                bat 'echo 构建完成'
            }
        }
    }
}