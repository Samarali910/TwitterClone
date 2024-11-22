import jwt from 'jsonwebtoken'

 export const genreatetocken = async (uid,res)=>{
        const tocken = jwt.sign(
            {uid},
            process.env.JWT_SECRETE,
            {expiresIn:process.env.EXPIRY}
        )
        console.log("tocken",tocken)
        const options={
            httpOnly:true,
            secure:true
        }
      res.status(201).cookie( "jwt_Tocken",tocken,options)
}