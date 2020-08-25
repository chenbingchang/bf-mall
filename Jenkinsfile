pipeline {
    agent { docker 'node:12.10' }
    stages {
        stage('build') {
            steps {
                sh 'npm i'
                sh 'npm run build'
            }
        }
    }
}