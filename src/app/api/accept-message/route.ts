import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/app/models/User";
import { authOptions } from "../auth/[...nextauth]/options";


export async function POST(request:Request) {
    await dbConnect
    const session= await getServerSession(authOptions)
    console.log("current session is",session);
    
    const user=session?.user
    if(!session || !session?.user){
        return Response.json({
            success:false,
            message:"user not logged in ,please log in first"
        })
    }
    try {
        const userId=user?._id
        console.log(userId);
        
        const {acceptingStatus}=await request.json()
        const updateUser=await userModel.findByIdAndUpdate(
            userId,
            {
            isAcceptingMessage:acceptingStatus
             }
    )
        if(!updateUser){
            return Response.json({
                success:false,
                message:"error while updating user status"
            })
        }
        return Response.json({
            success:true,
            message:"updated user status"
        })
        
    } catch (error) {
        console.log("error while updating user",error);
        
        return Response.json({
            success:false,
            message:"error while updating user status"
        })
        
    }

}

export async function GET(request:Request) {
    await dbConnect()
  
    const session= await getServerSession(authOptions)
    const user=session?.user
    if(!session || !session.user){
        return Response.json({
            success:false,
            message:"user not logged in ,please log in first"
        })
    }
    try {
        const userId=user?._id
        const foundedUser=await userModel.findOne({_id:userId})
        if(!foundedUser){
            return Response.json({
                success:false,
                message:"user not found"
            })
        }
        return Response.json({
            success:true,
            message:"fetched user status",
            isAcceptingMessages:foundedUser.isAcceptingMessage
        })

        
    } catch (error) {
        console.log("error while updating user",error);
        
        return Response.json({
            success:false,
            message:"error while fetching user status"
        })
    }
    
}