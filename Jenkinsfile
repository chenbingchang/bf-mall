pipeline {
    agent { docker 'node:12.10' }
    stages {
        stage('build') {
            steps {
              // unix使用sh;window使用bat
                bat 'npm i'
                bat 'npm run build'
            }
        }
    }
}