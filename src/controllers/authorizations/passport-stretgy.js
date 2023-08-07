const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const facebookStrategy = require('passport-facebook').Strategy;

const GOOGLE_CLIENT_ID = '194787117052-mdnfi6r9bn93eb4hl63om3mrnqmtu20r.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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'

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/google/callback",
    passReqToCallback: true
},
    function (request, accessToken, refreshToken, profile, done) {
        console.log(' --------------------> ', profile.displayName)
        console.log(' --------------------> ', profile.email)
        return done(null, profile);
    }
));

passport.use(new facebookStrategy({
    clientID: '592216448994610',
    clientSecret: 'b9895d5d2c466209333c25501332d9ae',
    callbackURL: "http://localhost:5000/facebook/callback",
    profileFields: ["email", "name"]
},
    function (request, accessToken, refreshToken, profile, done) {
        console.log(profile)
        return done(null, profile);
    }
));


passport.serializeUser(function (user, done) {
    done(null, user)
})

passport.deserializeUser(function (user, done) {
    done(null, user)
})