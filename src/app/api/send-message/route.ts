import { Message } from './../../models/User';
import dbConnect from "@/lib/dbConnect";
import userModel from "@/app/models/User";


export async function POST(request: Request) {
    await dbConnect()
    const { username, content } = await request.json()

    try {
        const user = await userModel.findOne({ username })
        if (!user) {
            return Response.json({
                success: "false",
                message: "failed to find user"
            })
        }
        if (!user.isAcceptingMessage) {
            return Response.json({
                success: "false",
                message: "user is not currently accepting message"
            })
        }
        const newMessage = { content, createdAt: new Date() }
        user.messages.push(newMessage)
        await user.save()
        return Response.json({
            success: "true",
            message: "message send successfully"
        })



    } catch (error) {
        console.log("error while sending messages", error);

        return Response.json({
            success: "false",
            message: "error while  sending messages"
        })

    }


}