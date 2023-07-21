class SiteController {
    // [GET] /
    home(req, res) {
        return res.render('home');
    }

    // [GET] /app
    app(req, res) {
        return res.render('app');
    }

    // [GET] /das
    das(req, res) {
        return res.render('das');
    }

    // [GET] /doc
    doc(req, res) {
        return res.render('doc');
    }
}

export default new SiteController;