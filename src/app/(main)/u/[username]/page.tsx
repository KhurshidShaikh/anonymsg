"use client"

import { messageSchema } from '@/schemas/messageSchema'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useToast } from '@/hooks/use-toast'
import axios from 'axios'
import { useParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState } from 'react'
import dummy from "@/dummy.json"
import Link from 'next/link'
import { Loader2 } from 'lucide-react'

const page = () => {
     const {toast}=useToast()
     const {username}=useParams()
     const [isSending,setIsSending]=useState(false)
     const [isGettingMessages,setIsGettingMessages]=useState(false)
     const [aiMessages,setAiMessages]=useState(dummy)
     
    const form = useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema),
        defaultValues: {
         content: "",
        },
      })


const onSubmit=async(data:z.infer<typeof messageSchema>)=>{
    setIsSending(true)
    try {
      const response=await axios.post(`/api/send-message`,{
        username,
        content:data.content
      })  
      toast({
        title:response.data.message,
        variant:"default"
       })
        
    } catch (error) {
        console.log("error while sending message");
    toast({
      title:"something went wrong",
      variant:"destructive"
    })
    }finally{
        setIsSending(false)
    }


}

const getAiMessages=async()=>{
  setIsGettingMessages(true)
try {
  const response= await axios.post(`/api/suggest-messages`)
  console.log(response.data.output);
 let msg= response.data.output
 let ai=msg.split('||')
 if(ai.length<1){
  setAiMessages(dummy)
 }
 setAiMessages(ai)
    
} catch (error) {
  console.log("error getting ai messages");
    toast({
      title:"something went wrong",
      variant:"destructive"
    })
}finally{
  setIsGettingMessages(false)
}
}

  return (
    <div className='min-h-screen w-full flex flex-col items-center p-4'>
        <div className='mx-auto border-2 mt-4 w-full max-w-3xl rounded-2xl p-4 md:p-6'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4 md:space-y-6">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem className="space-y-3 md:space-y-4">
                    <FormLabel className="text-base md:text-lg font-medium">Send Anonymous Message</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Type your message here..." 
                        {...field}
                        className="min-h-[50px] resize-none w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button type="submit" className="w-full md:w-auto" disabled={isSending}>
                  {isSending ? 'Sending...' : 'Send Message'}
                </Button>
              </div>
            </form>
          </Form>
        </div>

        <div className="mx-auto border-2 mt-4 w-full max-w-3xl rounded-2xl p-4 md:p-6">
          <div className='flex gap-3 items-center mb-4'>
            <Button 
              className="text-sm md:text-base font-medium" 
              onClick={()=>getAiMessages()}
              disabled={isGettingMessages}
            >
              Suggested Messages
            </Button> 
            {isGettingMessages && <Loader2 className='animate-spin'/>}
          </div>
           
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {aiMessages.map((message, index) => (
              message && (
                <Button
                  key={index}
                  variant="outline" 
                  onClick={() => {
                    form.setValue('content', message);
                  }}
                  className="text-sm p-2 h-auto min-h-[44px] whitespace-normal text-left"
                >
                  {message}
                </Button>
              )
            ))}
          </div>
        </div>
        
        <div className="mx-auto border-2 mt-4 mb-6 w-full max-w-3xl rounded-2xl p-4 md:p-6 text-center">
          <h3 className="text-base md:text-lg font-medium mb-2">Want to receive anonymous messages?</h3>
          <p className="text-gray-600 text-sm md:text-base mb-4">Join AnonyMsg to create your own anonymous message inbox!</p>
          <Button asChild className="w-full sm:w-auto">
            <Link href="/sign-up">Join Now</Link>
          </Button>
        </div>
    </div>
  )
}

export default page
