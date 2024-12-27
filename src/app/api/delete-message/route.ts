import dbConnect from "@/lib/dbConnect";
import userModel from "@/app/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";


export async function DELETE(request:Request) {
try {
    await dbConnect()

    const session=await getServerSession(authOptions)
    const user=session?.user

    if(!session || !session.user){
        return Response.json({
            success:"false",
            message:"user not logged in"
        })
    }


    const {searchParams}=new URL(request.url)
    console.log(decodeURIComponent(request.url)) 
     console.log(searchParams);
     
     const queryParams={
         messageId:searchParams.get("messageid")
     }
     console.log(queryParams.messageId);
        
     
     const userId=user?._id
    const foundUser=await userModel.findById(userId)
    const ismessage = foundUser?.messages?.some(message => message?._id.toString() === queryParams?.messageId);
     if(!ismessage){
        return Response.json({
            success:false,
            message:"message id not found"
        })
     }
    
     await userModel.findByIdAndUpdate(
        userId,
        { $pull: { messages: { _id: queryParams.messageId } } }
    );
      
   
    return Response.json({
        success:true,
        message:"message deleted"
    })

} catch (error) {
    console.log(error);
    return Response.json({
        success:false,
        message:"something went wrong"
    })
    
}






}


