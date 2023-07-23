import  Jwt  from "jsonwebtoken";

export const verifyToken = async(req,resp,next)=>{
    try {
        let token = req.header("Authorization");

        if(!token) return resp.status(403).send({success:false,message:"Access Denied"});
        if(token.startsWith("Bearer ")){
            token = token.slice(7,token.length).trimLeft();
        }

        const verified = Jwt.verify(token,process.env.SECRET_KEY)
        req.user = verified
        next()
    } catch (error) {
        resp.status(500).json({error:error.message})
        console.log("Error in verify token");
    }
}