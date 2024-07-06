import jwt from 'jsonwebtoken'
const jwtAuth=(req,res,next)=>{
    const token=req.headers['authorization'].split(' ')[1];
   // console.log('token is',token);
    if(!token){
        return res.status(401).json({error:'Unauthorzed'});
    }
    try{
        const payload=jwt.verify(token,process.env.JWT_SECRET);
        console.log('payload',payload);
        req.user=payload;// doing this to check if the user is admin or not in future
        next();
    }
    catch(error){
        console.log('yes',error)
        return res.status(401).json({error:'Unauthorzed'});
    }
}

export default jwtAuth