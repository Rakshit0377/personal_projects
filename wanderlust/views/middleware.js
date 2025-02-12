module.exports.isLoggedIn = (req, res, next) => {
    console.log("Authenticated:", req.isAuthenticated());
    if (!req.isAuthenticated()) {
        console.log("User not authenticated");
        req.session.redirectUrl = req.originalUrl;
                req.flash("error", "You must be logged in to create a listing");
        return res.redirect("/login");
    }
    console.log("User authenticated");
    next();
};
module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};
