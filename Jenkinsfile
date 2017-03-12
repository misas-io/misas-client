node {
  stage('checkout') {
    git url: 'git@github.com:misas-io/misas-client.git', branch: env.JOB_BASE_NAME
  }
  stage('build assets') {
    sh './docker/scripts/build_container.sh'
  }
  stage('test') {
    sh './docker/scripts/test_container.sh'
  }
  stage('publish test results') {
    publishHTML([allowMissing: false, alwaysLinkToLastBuild: false, keepAll: false, reportDir: 'coverage/html/', reportFiles: 'index.html', reportName: 'Code Coverage Reports'])
    junit 'tests/**/test-results.xml'
  }
  stage('build dist') {
    sh './docker/scripts/build_dist.sh'
  }
  stage('deploy dist') {
    sh './docker/scripts/deploy_dist.sh'
  }
}
