pipeline {
  agent any

  environment {
    NODE_ENV = 'test'
    PORT = '5050' 
    JWT_EXPIRE = '2 days'
    JWT_COOKIE_EXPIRE = '2'
    MONGO_URI = credentials('lions-den-api-test-mongo-uri')
    JWT_SECRET = credentials('lions-den-api-test-jwt-secret')
  }
  stages {
    stage("test") {
      steps {
        echo "Running in ${NODE_ENV} envrionment..."
        nodejs('Node14.2') {
          sh 'npm -v'
          sh 'npm install --only=prod'
          sh 'npx mocha --exit --timeout 5000'
          echo "Works"
        }
      }
    }
  }
}