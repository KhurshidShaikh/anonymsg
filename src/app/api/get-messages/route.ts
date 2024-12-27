import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/app/models/User";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function GET(request:Request) {
    await dbConnect
    const session= await getServerSession(authOptions)
    const user=session?.user
    if(!session || !session.user){
        return Response.json({
            success:false,
            message:"user not logged in ,please log in first"
        })
    }   
    
    const userId=new mongoose.Types.ObjectId(user?._id)
    try {
        const user=await userModel.aggregate([
            {$match:{_id:userId}},
            {$unwind:"$messages"},
            {$sort:{"messages.createdAt":-1}},
            {$group:{_id:"$_id",messages:{$push:"$messages"}}}

        ])
      
         
        

        if(!user){
            return Response.json({
                success:false,
                message:"failed to retrive user messages"
            })
        }
          if(user.length<1){
            return Response.json({
                success:true,
                message:"no messages"
            })
          }

        return Response.json({
            success:true,
            messages:user[0].messages
        },{
            status:200
        })
        
    } catch (error) {
        console.log("error while getting messages",error);
        
        return Response.json({
            success:false,
            message:"error while  getting messages"
        })
    }



}