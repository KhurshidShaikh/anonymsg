"use client"
import React from 'react'
import {format}from "date-fns"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
  import { Button } from "@/components/ui/button"

import {Trash2 } from 'lucide-react'
import { Message } from '@/app/models/User'
import axios from 'axios'
import { useToast } from '@/hooks/use-toast'







type MessageProps={
    message:Message;
    messages:Message[]
   setMessages:(messages: Message[]) =>void
}


const MessageCard = ({message,messages,setMessages}:MessageProps) => {
const {toast}=useToast()

const handleMessageDelete=async()=>{
try {
  const response=await axios.delete(`/api/delete-message?messageid=${message._id}`)
  console.log(response);
   let newmsg=messages.filter((msg)=>msg._id!==message._id)
   setMessages(newmsg)
   toast({
      title:response.data.message
   })
} catch (error) {
  console.log("error while deleting message");
  
  toast({
    title:"something went wrong"
 })
}


}







    return (
        <Card className='shadow-2xl md:w-1/3 w-full h-[200px]'>
            <CardHeader>
                <CardTitle className='text-xl font-semibold'>{message.content}</CardTitle>

                <CardDescription className='text-zinc-400'>
                {message?.createdAt ? format(new Date(message.createdAt), 'Pp') : ''}

                </CardDescription>
            </CardHeader>
           
            <CardFooter className='flex justify-end'>
            <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className='w-10'><Trash2 className='text-red-500'/></Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
           message and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={()=>handleMessageDelete()}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
            
            </CardFooter>

        </Card>
    )
}

export default MessageCard
