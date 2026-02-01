

/**
 * Web controller for rendering views
 */
class WebController {
  constructor() {
    // constructor
  }

  /**
   * Render home view
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  homeView(req, res) {
    return res.render("home");
  }
}

module.exports = new WebController();
