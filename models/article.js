
module.exports = (sequelize)=>{
    const Sequelize = require('sequelize');
    
    return  Article = sequelize.define('article', {
        title: {
            type: Sequelize.STRING
        },
        content: {
            type: Sequelize.TEXT
        }
    
    });
}
