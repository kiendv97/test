
// key words up / down 
module.exports = (sequelize)=>{
    const Sequelize = require('sequelize');
    return  Account = sequelize.define('account',{
     name : {
         type: Sequelize.STRING
     },
     password: {
         type: Sequelize.STRING
     },
     email: {
         type: Sequelize.STRING
     }
      
    });
  };