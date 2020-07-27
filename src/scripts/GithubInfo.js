export default class GithubInfo {
  constructor(user = "KacperBiedka") {
    this.info = {};
    this.user = user;
    this.error = null;
    this.getUserInfo();
  }
  getUserInfo() {
    fetch(`https://api.github.com/users/${this.user}/contributions`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        this.info = data.body;
        console.log(this.info);
      })
      .catch((error) => {
        this.error = error;
        console.log(this.error);
      });
  }
}
