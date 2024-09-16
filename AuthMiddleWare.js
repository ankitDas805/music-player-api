const jwt=require("jsonwebtoken");


exports.authMiddleware=function (req,res,next){
try{

 let privateKey="Radha"
let token=req.header("token");
if(token){
    let verifiedToken=jwt.verify(token,privateKey,{expiresIn:"20m"});
console.log("----verifiedToken---",verifiedToken)
if(verifiedToken)
{
    req.user=verifiedToken
    console.log("req---", req.user)
    next()

}
else{
    res.json("credentials are wrong, YOU ARE A FRAUD!!!!!!!")
}
}
else {
    console.log("token is missing")
}






}
catch(err){
    console.log("Error is Authmiddleware---", err)
    next(err)
    
}

}

