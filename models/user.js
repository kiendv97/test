
// key words up / down 
  module.exports = (sequelize)=>{
    const Sequelize = require('sequelize');
    return  User = sequelize.define('user',{
      firstname:{
        type:  Sequelize.STRING
      },
      lastname: {
        type: Sequelize.STRING
      }
      
    });
  };