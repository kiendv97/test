
        const jwt = require('jsonwebtoken');
module.exports =  (req,res,next)=>{
    try{

       console.log(req.session);
       
       jwt.verify(req.session.token,'jwt',(err,authData)=>{
            if(err){
                console.log(err);
                
                res.sendStatus(401)
            } else {
                next();
            }
        });
  
       
    }
    catch(error){
       
        
        res.sendStatus(403).json({
            message : "Author failed"
        })
    }
}