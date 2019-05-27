workflow "Deploy prod" {
  on = "push"
  resolves = ["Deploy"]
}

action "Install" {
  uses = "borales/actions-yarn@master"
  args = "install"
  env = {
    BRANCH = "gh-pages"
    FOLDER = "build"
  }
  secrets = ["ACCESS_TOKEN"]
}

action "Build" {
  uses = "borales/actions-yarn@master"
  args = "build"
  needs = ["Install"]
}

action "Deploy" {
  uses = "JamesIves/github-pages-deploy-action@master"
  needs = ["Build"]
}
