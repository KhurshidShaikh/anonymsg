import dbConnect from "@/lib/dbConnect";
import userModel from "@/app/models/User";


export async function POST(request:Request) {
     try {
        await dbConnect()
        const {username,otp}=await request.json()

        const user= await userModel.findOne({
            username,
            isVerified:false
        })
         
        if(!user){
            return Response.json({
                success:"true",
                message:"user verified"
            })
        }

        const isOtpVerified=user?.verficationCode===otp
        const isOtpNotExpired = user?.verificationCodeExpiry && new Date(user.verificationCodeExpiry) > new Date()
        if(isOtpNotExpired && isOtpVerified){
            user.isVerified=true
            await user.save()
            return Response.json({
                success:"true",
                message:"otp verified successfully"
            })
        }
        else if(!isOtpVerified){
            return Response.json({
                success:"false",
                message:"Incorrect verfication code"
            })
        }
        else{
            return Response.json({
                success:"false",
                message:"verification code expired . please sign in again"
            })
        }


        
    } catch (error) {
        console.log("error while otp checking",error);
    return Response.json({
        success:"false",
        message:"error while otp validation"
    })
    }
    
}