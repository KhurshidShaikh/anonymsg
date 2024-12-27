import { resend } from "@/lib/resend";
import VerifyEmailTemplate from "../../email/verificicationTemplate";
import { ApiResponse } from "@/types/ApiResponse";

export async function  sendVerificationEmail(
    username:string,
    email:string,
    otp:string
):Promise<ApiResponse> {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Anonymsg <onboarding@resend.dev>',
            to: [email],
            subject: 'Verification Email',
            react: VerifyEmailTemplate({username,otp}),
          });

       if(data){
        return{
            success:true,
            message:"email send!"
        }
       }

        return{
            success:false,
            message:"error sending email"
        }
        
    } catch (error) {
        console.log("Error sending email",error);
        return{
            success:false,
            message:"error sending email"
        }
        
    }
}