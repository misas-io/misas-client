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
  stage('deploy assets') {
    sh './docker/scripts/deploy_container.sh'
  }
}
