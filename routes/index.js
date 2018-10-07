var express = require('express');
var router = express.Router();
const Sequelize = require('sequelize');
const jwt = require('jsonwebtoken');
const checkAuthor = require('../middeware/jwt');
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
const passport = require('../config/passport');
const User = require('../models/user')(sequelize);
const Article = require('../models/article')(sequelize);
const Account = require('../models/account')(sequelize);
/* GET home page. */
function isAuthen(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/signin');
  }
}

router.post('/', (req, res, next) => {
  var token = jwt.sign({user: { email: 'kien@gmail.com', password: '1234' }}, 'jwt',(err,token) =>{
    res.json({
    message: 'success',
    token: token
  })
  })
  
});
router.post('/1', (req, res, next) => {
  jwt.verify(req.headers.authorization, 'jwt', (err, authData) => {
    if (err) {
      console.log(req.headers.authorization);
      
      console.log(err);

      res.sendStatus(401)
    } else {
      res.send(authData)

      next();
    }
  })
});
router.get('/', (req, res, next) => {

  res.render('index', { title: "Hello World", user: req.user, message: req.flash('message') });
});

router.get('/adduser', (req, res, next) => {
  res.render('adduser', { title: "Hello World" });
});

router.post('/user', checkAuthor, (req, res, next) => {
  User
    .build({
      firstname: req.body.firstname,
      lastname: req.body.lastname
    })
    .save()
    .then(() => {
      console.log("Add Success");

      res.redirect('/user')
    })
});


router.delete('/user/:id', isAuthen, (req, res, next) => {
  User.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(() => {
      res.redirect('/user')
    })
});

router.get('/user/:id', (req, res, next) => {
  User
    .find({
      where: {
        id: req.params.id
      }
    })
    .then((user) => {
      res.send(JSON.stringify(user));
    })
});
router.get('/updateuser/:id', (req, res, next) => {
  User
    .find({
      where: {
        id: req.params.id
      }
    })
    .then((user) => {
      res.render('updateuser', { user: user });

    })
});
router.put('/user/:id', isAuthen, (req, res, next) => {
  User
    .update({
      firstname: req.body.firstname,
      lastname: req.body.lastname
    }, {
        where: {
          id: req.params.id
        }
      })
    .then(() => {
      res.redirect('/user');
    })
})
router.get('/user', function (req, res, next) {
  sequelize.sync({ force: false })
    .then(() => {
      User.findAll({})
        .then((users) => {
          res.render('viewuser', { users: users })
        });


    })

});

router.get('/article', function (req, res, next) {
  sequelize.sync()
    .then(() => {
      Article.findAll({})
        .then((articles) => {
          res.render('viewarticle', { articles: articles });
        });


    })

});
router.get('/addarticle', (req, res, next) => {
  res.render('addarticle', { title: 'hello Article' });
});
router.get('/updatearticle/:id', (req, res, next) => {
  Article.find({
    where: {
      id: req.params.id
    }
  })
    .then((article) => {
      res.render('updatearticle', { article: article });
    })

});
router.delete('/article/:id', isAuthen, (req, res, next) => {
  Article.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(() => {
      res.redirect('/article');
    })
});
router.put('/article/:id', isAuthen, (req, res, next) => {
  Article.update({
    title: req.body.title,
    content: req.body.content
  }, {
      where: {
        id: req.params.id
      }
    })
    .then(() => {
      res.redirect('/article');
    })
});
router.post('/article', isAuthen, (req, res, next) => {
  Article.build({
    title: req.body.title,
    content: req.body.content
  })
    .save()
    .then(() => {
      console.log("Artice add success ");
      res.redirect('/article');

    })
});
router.get('/article/:id', (req, res, next) => {
  Article.find({
    where: {
      id: req.params.id
    }
  })
    .then((article) => {
      res.end(JSON.stringify(article));
    })
});

router.get('/signup', (req, res, next) => {
  if (!req.user) {
    res.render('signup', { title: "Sign Up" });
  } else {
    res.redirect('/')
  }
});



router.get('/signin', (req, res, next) => {
  if (!req.user) {

    res.render('login', { title: "Sign In" });

  } else {
    res.redirect('/')
  }
});

router.post('/signup', passport.authenticate('signup', {
  successRedirect: '/',
  failureRedirect: '/signup',
  failureFlash: true

}));


router.post('/signin', passport.authenticate('signin', {
  successRedirect: '/',
  failureRedirect: '/signin',
  failureFlash: true
}))


router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/signin');
});



module.exports = router;
