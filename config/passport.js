const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;
const Sequelize = require('sequelize');
const jwt = require('jsonwebtoken');
const sequelize = new Sequelize('test_schema', 'root', 'password', {
    host: 'localhost',
    dialect: 'mysql',
    operatorsAliases: false,
    pool: {

    }
});
sequelize
    .authenticate()
    .then(() => {
        console.log("Access");

    })
const Account = require('../models/account')(sequelize);
const bcrypt = require('bcrypt');

passport.serializeUser(function (user, done) {
    done(null, JSON.stringify(user));
});

passport.deserializeUser(function (user, done) {
    done(null, JSON.stringify(user));

});
passport.use('signin', new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    function (req, email, password, done) {
        {

        }
        Account.findOne({
            where: {
                email: email
            }
        })
            .then((user) => {


                if (!user) {

                    return done(null, false, { message: req.flash('message', 'Incorrect username.') });
                }
                if (!bcrypt.compareSync(password, user.password)) {
                    return done(null, false, { message: req.flash('message', 'Incorrect password.') });
                } else {
                    var token = jwt.sign(JSON.stringify(user), 'jwt');
                    req.session.token = token;
                    console.log(req.session);
                    return done(null, JSON.stringify(user), { message: req.flash('message', 'Log in success') });

                }
            })
    }
));


passport.use('signup', new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    function (req, email, password, done) {
        var salt = bcrypt.genSaltSync(10);
        var hash1 = bcrypt.hashSync(password, salt);
        var hash2 = bcrypt.hashSync(req.body.password2, salt);
        Account.findOne({
            where: { email: email }
        })
            .then(function (user) {

                if (!user) {


                    var password2 = req.body.password2;

                    console.log(password);

                    if (password.toString() !== password2.toString()) {


                        return done(null, false, { message: req.flash('message', 'Repassword incorrect') });
                    }
                    else {
                        Account.create({
                            name: req.body.name,
                            email: req.body.email,
                            password: hash1
                        });
                        return done(null, JSON.stringify(user), { message: req.flash('message', 'Success') });

                    }
                }


                return done(null, false, { message: req.flash('message', 'Email already exitst') });
            });
    }
));
module.exports = passport;