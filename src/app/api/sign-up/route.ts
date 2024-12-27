import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcryptjs"
import userModel from "@/app/models/User";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        await dbConnect()
        const { username, email, password } = await request.json()
        const existingUserbyUsername = await userModel.findOne({
            username,
            isVerified: true
        })
        if (existingUserbyUsername) {
            return NextResponse.json({
                success: false,
                message: "user already exists"
            })
        }

        const existingUserbyEmail = await userModel.findOne({ email })
        const verficationCode = Math.floor(100000 + Math.random() * 900000).toString();
        if (existingUserbyEmail) {
            //already existing user and verified case
            if (existingUserbyEmail.isVerified) {
                return NextResponse.json({
                    success: false,
                    message: "user already verified"
                })
            } else {
                //already existing user but unverified case
                const hashedPassword = await bcrypt.hash(password, 10)
                const verificationCodeExpiry = new Date(Date.now() + 60 * 60 * 1000);
                existingUserbyEmail.password = hashedPassword
                existingUserbyEmail.verficationCode = verficationCode
                existingUserbyEmail.verificationCodeExpiry = verificationCodeExpiry
                await existingUserbyEmail.save()
            }

        } else {
            //new user case
            const hashedPassword = await bcrypt.hash(password, 10)
            const verificationCodeExpiry = new Date(Date.now() + 60 * 60 * 1000);

            const newUser = new userModel({
                username,
                email,
                password: hashedPassword,
                isVerified: false,
                verficationCode,
                verificationCodeExpiry,
                isAcceptingMessage: true,
                messages: []
            })

            await newUser.save()
        }

        //sending email
        const emailResponse = await sendVerificationEmail(username, email, verficationCode)
        if (!emailResponse.success) {
            console.log(emailResponse);
            
            return NextResponse.json({
                success: false,
                message: "error while sending email"
            }, { status: 201 })

        }
        return NextResponse.json({
            success: true,
            message: "user registered successfully"
        })



    } catch (error) {
        console.error("error while signup: ", error);
        return NextResponse.json({
            success: false,
            message: "erro while signup process"
        }, {
            status: 500
        })

    }


}