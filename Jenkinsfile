// -*- mode: groovy -*-
// vim: set filetype=groovy :

// Required plugins
// - Pipeline
// - Pipeline: Multibranch
// - HTTP Request Plugin
// - Stash Notifier
// - Timestamper

properties( [
  disableConcurrentBuilds(),
  [ $class: 'BuildDiscarderProperty', strategy: [ $class: 'LogRotator', daysToKeepStr: '25' ] ],
] )

podLabel = "react-dnd-ax-${UUID.randomUUID()}"

lastSuccessfulCommit = getLastSuccessfulCommit()
currentCommit = commitHashForBuild(currentBuild.rawBuild)

podTemplate(
  label: podLabel,
  serviceAccount: env.KUBERNETES_SERVICE_ACCOUNT,
  annotations: [
    podAnnotation(key: 'iam.amazonaws.com/role', value: 'arn:aws:iam::392477962641:role/learn-ci-jenkins-agent')
  ],
  containers: [
    containerTemplate(name: 'build', image: 'node:8', ttyEnabled: true, command: '/bin/cat')
  ],
  volumes: [
    secretVolume( secretName: 'npm-publish-token', mountPath: '/home/jenkins/npm-publish-token' ),
    secretVolume( secretName: 'stash-jenkins-nirvana', mountPath: '/home/jenkins/ssh-stash-jenkins-nirvana' ),
  ]){
  // common pipeline template
  try {
    withSlaveAndEnvironment(podLabel) {
      // begin custom pipeline steps
      container('build') {
        gitCheckout(true)
        withStashCredentials {
          withNotifications {
            prepare()
            unitTest()
            build()
            if( isProductionBranch() && needToBumpVersion() ) {
              publishToRepo()
            }
          }
        }
      }
    }
  }
  catch (error) {
      echo "Error running pipeline, stack follows"
      error.printStackTrace()
  }
}

// Begin common pipeline template methods
def withSlaveAndEnvironment(String label, Closure block) {
  node(label) {
    timestamps {
      block()
    }
  }
}

def withStashCredentials( Closure block ) {
  try {
    def name = 'Jenkins'
    def email = "jenkins@blackboard.com"

    // Temporary activate the credentials volume and set up git
    sh """#!/usr/bin/env bash
      set -ex

      rm -rf /root/.ssh

      cp -R /home/jenkins/ssh-stash-jenkins-nirvana /root/.ssh

      chmod 400 /root/.ssh/id_rsa

      git config --global user.name $name
      git config --global user.email $email
    """

    def envVars = [
      "GIT_AUTHOR_NAME=$name",
      "GIT_AUTHOR_EMAIL=$email",
      "GIT_COMMITTER_NAME=$name",
      "GIT_COMMITTER_EMAIL=$email",
      "NPM_CONFIG_LOGLEVEL=warn"
    ]
    withEnv( envVars ) {
      block()
    }
  } finally {
    sh 'rm -rf /root/.ssh'
  }
}

//
// Build stage methods
//
def gitCheckout( showInChangelog ) {
  checkout changelog: showInChangelog, scm: [
    $class: 'GitSCM',
    branches: [ [ name: env.BRANCH_NAME ] ],
    browser: [ $class: 'Stash', repoUrl: 'https://stash.bbpd.io/projects/SHARED/repos/react-dnd-ax' ],
    extensions: [
      [ $class: 'PruneStaleBranch' ],
      [ $class: 'LocalBranch', localBranch: env.BRANCH_NAME ],
    ],
    userRemoteConfigs: [ [
      credentialsId: 'jenkins-stash',
      url: 'ssh://git@stash.bbpd.io/shared/react-dnd-ax.git',
    ] ]
  ]
}

def withNotifications( Closure block ) {
  try {
    notifyStash()
    block()
    currentBuild.result = 'SUCCESS'
  } catch( error ) {
    currentBuild.result = 'FAILURE'
    echo "ERROR: ${error.message}"
    throw error
  } finally {
    sendNotifications()
  }
}

def prepare() {
  stage('Prepare') {
    sh '''#!/usr/bin/env bash
      set -e
      echo "DEBUG: Environment $(env)"
      npm install
      echo "==== Post Configuration Summary ========"
      echo "* Home directory: $HOME"
      echo "* Node version: $(node --version)"
      echo "* NPM version: $(npm --version)"
      echo "* Node location: $(type -p node)"
      echo "* NPM location: $(type -p npm)"
      echo "==== End Post Configuration Summary ===="
    '''
  }
}

def build() {
  stage('Build') {
    npm "run npm:clean"
    npm "run build"
  }
}

def unitTest() {
  stage('Unit Tests') {
    sh '''#!/usr/bin/env bash
      set -e
      npm run test:coverage
    '''
    publishHTML( target: [
      allowMissing: false,
      alwaysLinkToLastBuild: true,
      keepAll: true,
      reportDir: 'coverage/lcov-report',
      reportFiles: 'index.html',
      reportName: 'Code Coverage Report'
    ] )
    // step( [ $class: 'JUnitResultArchiver',
    //         testResults: 'test-report.xml',
    //         testDataPublishers: [ [ $class: 'AttachmentPublisher' ] ]
    //       ] )
  }
}

def npm(npmTask) {
  sh """#!/usr/bin/env bash
    npm $npmTask
  """
}

def publishToRepo() {
  stage('Publish to NPM Repo') {
    def npmRegistry = "//npm.bbpd.io/repository/bb-npm-private/:_authToken="
    def npmToken = sh( script: "cat /home/jenkins/npm-publish-token/token", returnStdout: true)
    sh "echo ${npmRegistry + npmToken} > $HOME/.npmrc"
    npm "version patch -m \"Automatic version bump to %s\""
    git "push origin $BRANCH_NAME"
    npm "publish"
  }
}

def sendNotifications() {
  notifyStash()
  if(isProductionBranch()) {
    notifySlack()
  }
}

//
// Utility Methods
//

def notifySlack() {
  def baseMessage = "${currentBuild.result}:"
  def message
  def color
  def currentBuild = currentBuild
  def previousBuild = currentBuild.previousBuild

  if( currentBuild.result == 'SUCCESS' && previousBuild == null ) {
    color = 'good'
    message = "${baseMessage} First build OK. Job '${env.JOB_NAME}, ${env.BUILD_URL}"
  } else if( currentBuild.result == 'SUCCESS' && previousBuild.resultIsWorseOrEqualTo( 'UNSTABLE' ) ) {
    color = 'good'
    message = "${baseMessage} Back to normal. Job '${env.JOB_NAME}, ${env.BUILD_URL}"
  } else if( currentBuild.resultIsWorseOrEqualTo( 'UNSTABLE' ) ) {
    color = 'danger'
    message = "${baseMessage} Job '${env.JOB_NAME}, ${env.BUILD_URL}"
  } else if( currentBuild.result == 'SUCCESS' ) {
    return
  }
  slackSend tokenCredentialId: 'slack-learn-engineering',
            color: color,
            message: message,
            channel: '#notification-tests'
}

def notifyStash() {
  echo "DEBUG: Notifying Stash. State is ${currentBuild.result}"
  step( [ $class: 'StashNotifier', credentialsId: 'jenkins-notify' ] )
}

/**
 * Indicates whether this is a production branch - production branches are published to the CDN.
 */
def isProductionBranch() {
  return isDevelop() ||
         isReleaseBranch()
}

/**
 * Indicates whether this is the 'develop' branch.
 */
def isDevelop() {
  return env.BRANCH_NAME == 'develop'
}

/**
 * Indicates if this is a release branch
 */
def isReleaseBranch() {
  return env.BRANCH_NAME.startsWith( 'release/' )
}

/**
 * Gets the commit hash from a Jenkins build object, if any
 */
@NonCPS
def commitHashForBuild(build) {
  def scmAction = build?.actions.find { action -> action instanceof jenkins.scm.api.SCMRevisionAction }
  return scmAction?.revision?.hash
}

/**
 * Get the commit has for last successful build
 */
def getLastSuccessfulCommit() {
  return commitHashForBuild(currentBuild.rawBuild.getPreviousSuccessfulBuild())
}

/**
 * Utility method to run git and handle splitting its output
 */
def git(command) {
  def output = []
  outputRaw = sh(
    script: "git $command",
    returnStdout: true
  )
  if ( !outputRaw.empty ) {
    output = outputRaw.split('\n')
  }
  return output
}

/**
 * The names of files changed since the last successful build
 */
def getFilesChangedSinceLastSuccessfulBuild() {
  def filesChanged = []
  if (lastSuccessfulCommit) {
    filesChanged = git "diff --name-only $currentCommit '^$lastSuccessfulCommit'"
  }
  echo "DEBUG: Files changed $filesChanged (size ${filesChanged.size()})"
  return filesChanged
}

/**
 * Get changes as a list without context
 */
def getContextFreeChanges() {
  def contentsChanged = []
  if (lastSuccessfulCommit) {
    contentsChanged = git "diff --unified=0 $lastSuccessfulCommit $currentCommit | egrep '^\\+ ' || exit 0"
  }
  echo "DEBUG: Contents changed: $contentsChanged (size ${contentsChanged.size()})"
  return contentsChanged
}

/**
 * Do we need to actually increment version in package.json
 */
def needToBumpVersion() {
  def filesChanged = getFilesChangedSinceLastSuccessfulBuild()
  if (filesChanged.size() == 0) {
    echo "INFO: No files changed, no need to bump version"
    return false
  }
  if (filesChanged.size() == 1 && filesChanged[0] == 'package.json') {
    def contentsChanged = getContextFreeChanges()
    if (contentsChanged.size() == 1 && contentsChanged[0] =~ /"version":/) {
      echo "INFO: Don't need to bump version, it has already been done"
      return false
    }
  }
  echo "INFO: We do need to bump the version, more than just package.json version string changed"
  return true
}
