import mongoose from "mongoose";

type connectionObject={
    isConnected?:number
}

const connection:connectionObject={

}


async function dbConnect():Promise<void> {
    if(connection.isConnected){
     console.log("connection already established");
     return
    }
    try {
        const db=await mongoose.connect(process.env.MONGOOSE||"")
         connection.isConnected=db.connections[0].readyState
         
         console.log("connected succesfully");
         
    } catch (error) {
        console.log(error);
        
        process.exit(1)
    }
}


export default dbConnect;