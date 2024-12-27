import  bcrypt  from 'bcryptjs';
import CredentialsProvider from "next-auth/providers/credentials"
import {NextAuthOptions, User} from "next-auth"
import dbConnect from "@/lib/dbConnect"
import userModel from "@/app/models/User"
import GoogleProvider from "next-auth/providers/google";


export const authOptions:NextAuthOptions={
providers:[
 CredentialsProvider({
    name: 'Credentials',
     
    credentials: {
        email: { label: "email", type: "text"},
        password: { label: "Password", type: "password" }
      },

      async authorize(credentials:any):Promise<any>{
        await dbConnect()
        try {
            if(credentials){
            
        const identifier = credentials.identifier?.trim().toLowerCase();
        const user=await userModel.findOne({
            $or:[
                {email:identifier},
                {username:identifier}
            ]
        })
        if (!user) {
            throw new Error("User not found. Please check your credentials.");
        }
        
       if(!user?.isVerified){
        throw new Error("User is not verified please ! verify your email first")
       }
       const isPasswordVerified=await bcrypt.compare(credentials.password,user.password)
       if(isPasswordVerified){
        return user
       }else{
        throw new Error("Invalid Credentials")
       }

    }else{
        return null
    }

            
        } catch (error) {
            console.log("error during sign in in next auth:",error);
            throw new Error("Authentication failed");
            
        }
      }

 }),

 GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID||'',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
  })

],

callbacks:{
    async signIn({ user }) {
        await dbConnect();
        
        const existingUser = await userModel.findOne({ email: user.email });
        
        if (!existingUser) {
          
            const newUser = new userModel({
                email: user.email,
                username: user.email?.split('@')[0] || '',
                isVerified: true,  
            });
            await newUser.save();
            user.username = newUser.username;
            user.email=newUser.email
            user.isAcceptingMessages=newUser.isAcceptingMessage
            user.isVerified=newUser.isVerified
            user._id=newUser._id.toString()
        }else {
            
            user.username = existingUser.username;
            user.email=existingUser.email
           user.isAcceptingMessages=existingUser.isAcceptingMessage
           user.isVerified=existingUser.isVerified
           user._id=existingUser._id.toString()
        }
        return true;
    },
    async jwt({ token, user }) {
       
        if(user){
            
            token._id=user._id?.toString()
            token.isVerified=user.isVerified
            token.email = user.email;
            token.isAcceptingMessages=user.isAcceptingMessages
            token.username = user.username 
        }
       
        return token
      },


    async session({ session,token }) {
       
        if(token){
            session.user._id=token._id
            session.user.email = token.email;
            session.user.isVerified=token.isVerified
            session.user.isAcceptingMessages=token.isAcceptingMessages
            session.user.username=token.username
        }
        
        return session
      }
    

},

pages:{
    signIn: '/sign-in',
},
session:{
    strategy:"jwt"
},
secret:process.env.SECRET

}