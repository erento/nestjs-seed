projectBaseName = "x---service-slug---x"
appVersion = env.BUILD_ID
if (env.BRANCH_NAME != "master") {
    appVersion = "DEV${generateMD5(env.BRANCH_NAME)}_V_${env.BUILD_ID}"
}

imageName = "${projectBaseName}:${appVersion}"
buildServiceImage = docker.image('node:11.15')

node {
    stage("checkout") {
        //cleanWs()
        checkout scm
    }

    stage("prepare dependencies") {
        buildServiceImage.inside('--tmpfs /home/jenkins:size=512M -e HOME=/home/jenkins') {
            sh(script: "npm install")
            sh(script: "npm run clean-dist")
        }
        milestone(label: 'dependencies ready')
    }

    stage("linting and unit tests") {
        parallel(
            "linting": {
                buildServiceImage.inside('--tmpfs /home/jenkins:size=512M -e HOME=/home/jenkins') {
                    sh(script: "npm run test:single")
                }
            },
            "unit test": {
                buildServiceImage.inside('--tmpfs /home/jenkins:size=512M -e HOME=/home/jenkins') {
                    sh(script: "npm run lint")
                }
            }
        )
        milestone(label: "linting and unit tests complete")
    }

    stage("build service") {
        buildServiceImage.inside('--tmpfs /home/jenkins:size=512M -e HOME=/home/jenkins') {
            sh(script: "npm run build")
        }
        milestone(label: 'service built')
    }

    stage("bake service image") {
        def myImage = docker.build("eu.gcr.io/erento-docker/${imageName}", "--build-arg appVersion=${appVersion} .")
        myImage.push()
        milestone(label: 'image ${imageName} baked')
    }

    stage("deploy to beta") {
        deploy(projectBaseName, imageName, "beta", "deploy", "gcs-repo/erento-app")
        milestone(label: "deployed to beta")
    }
}

if (env.BRANCH_NAME == "master") {
    stage('master to production') {
        milestone(label: 'awaiting deploy to prod')

        try {
            input(message: 'Deploy to production?', ok: 'Deploy')
        } catch (err) {
            def user = err.getCauses()[0].getUser()
            echo "Aborted by: [${user}]"
            currentBuild.result = 'NOT_BUILT'
            throw err
        }

        node {
            deploy(projectBaseName, imageName, "production", "deploy", "gcs-repo/erento-app")
            milestone(label: "deployed to production")
        }
    }
}
