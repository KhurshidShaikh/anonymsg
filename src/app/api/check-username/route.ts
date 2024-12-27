import dbConnect from "@/lib/dbConnect";
import userModel from "@/app/models/User";
import { usernameValidation } from "@/schemas/signUpSchema";
import {z} from "zod"



const UsernameValidationSchema=z.object({
    username:usernameValidation
})

export async function GET(request:Request) {
try {
    await dbConnect()
    const {searchParams}=new URL(request.url)
   console.log(decodeURIComponent(request.url)) 
    console.log(searchParams);
    
    const queryParams={
        username:searchParams.get("username")
    }
    
    const result=UsernameValidationSchema.safeParse(queryParams)
    console.log("this is result",result);
    const username=result?.data?.username
    console.log(username);
    
    if(!result.success){
        const usernameerrors=result.error.format().username?._errors|| [];
        console.log(usernameerrors);
        
        return Response.json({
            success:"false",
            message:usernameerrors.length>0?usernameerrors.join(","):"Invalid Query params"
        })
    }
    const user= await userModel.findOne({
          username,
          isVerified:true
    })
     
    if(user){
        return Response.json({
            success:"false",
            message:"username not available"
        })
    }

    return Response.json({
        success:"true",
        message:"username available"
    })
      

    


} catch (error) {
    console.log("error while username checking",error);
    return Response.json({
        success:"false",
        message:"error while username validation"
    })
    
}
    
}