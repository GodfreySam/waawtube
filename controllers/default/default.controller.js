module.exports = {
    home: (req, res) =>{
        let pageTitle = "Home page";
        res.render('default/index', {pageTitle: pageTitle});
    }
}