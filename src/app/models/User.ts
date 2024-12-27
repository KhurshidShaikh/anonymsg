
import mongoose,{mongo, Schema} from "mongoose";


export interface Message{
  _id?:mongoose.ObjectId  
 content:string,
 createdAt:Date
}

const MessageSchema:Schema<Message>= new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        auto: true
      },
   content :{
    type:String,
    required:true
   },
   createdAt:{
    type:Date,
    default:Date.now
   }
})

export interface User{
    username:string,
    email:string,
    password:string,
    isVerified:boolean,
    verficationCode:string,
    verificationCodeExpiry:Date,
    isAcceptingMessage:boolean,
    messages:Message[]
}

const userSchema:Schema<User>=new Schema({
username:{
    type:String,
    required:[true,"Username is required"],
    unique:true
},
email:{
    type:String,
    required:[true,"Email is required"],
    unique:true
},
password:{
    type:String,

},
isVerified:{
    type:Boolean,
    default:false
},
isAcceptingMessage:{
    type:Boolean,
    default:true
},
verficationCode:{
    type:String
},
verificationCodeExpiry:{
    type:Date
},
messages:[MessageSchema]

})

const userModel=(mongoose.models.User as mongoose.Model<User>)|| mongoose.model<User>("User",userSchema)

export default userModel