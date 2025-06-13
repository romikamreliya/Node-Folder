

class WebController {
  constructor() {
  }

  homeView = (req, res) => {
    return res.render("home");
  };

}
module.exports = new WebController();
