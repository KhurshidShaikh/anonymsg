"use client"
import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useState } from 'react'
import { Message } from '../../models/User'
import { User } from 'next-auth'
import { useToast } from '@/hooks/use-toast'
import axios from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema'
import Loader from '@/components/custom/Loader'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import MessageCard from '@/components/custom/MessageCard'


const Page = () => {
const [messages,setMessages]=useState<Array<Message>>([])
const [isFetchingMessages,setIsFetchingMessages]=useState<boolean>()
const [isAcceptingMessages,setIsAcceptingMessages]=useState<boolean>(false)
const [baseUrl, setBaseUrl] = useState("");

const {toast}=useToast()

  const {data:session,status}=useSession()
  const user:User=session?.user as User
  console.log("session is",session);
  
 
  useEffect(() => {
    setBaseUrl(window.location.origin); 
  }, []);

  const profileUrl = user?.username ? `${baseUrl}/u/${user.username}` : "";



const form = useForm<z.infer<typeof acceptMessageSchema>>({
  resolver: zodResolver(acceptMessageSchema),
  defaultValues: {
    accept:isAcceptingMessages
  },
})



const fetchMessages=useCallback(async()=>{
  setIsFetchingMessages(true)
  try {
    const response= await axios.get<ApiResponse>('/api/get-messages')
     console.log("messages",response);
     
    const reteivedmessages = response.data.messages || []
    setMessages(reteivedmessages)
   
    
  } catch (error) {
    console.log("error while fetching messages");
    toast({
      title:"something went wrong",
      variant:"destructive"
    })
    
  }finally{
    setIsFetchingMessages(false)
  }
},[toast])


const fetchAcceptingStatus=useCallback(async()=>{
  try {
    const response= await axios.get<ApiResponse>('/api/accept-message')
    
    
    let status=response?.data?.isAcceptingMessages??false
    setIsAcceptingMessages(status)
  
   
  } catch (error) {
    console.log("error while fetching acceptance status");
    toast({
      title:"something went wrong",
      variant:"destructive"
    })
  }

},[toast])



const onSubmit=async(value :boolean)=>{
  try {
    setIsAcceptingMessages(value)
    const response= await axios.post('/api/accept-message',{
      acceptingStatus:value
    })
       toast({
        title:response.data.message,
        variant:"default"
       })
  } catch (error) {
    console.log("error while updating acceptance status");
    toast({
      title:"something went wrong",
      variant:"destructive"
    })
  }

}



useEffect(() => {
  fetchAcceptingStatus();
  fetchMessages();
}, [fetchAcceptingStatus, fetchMessages]);


if(status==="loading"){
  return <Loader/>
}

  return (
    <>
      {status==="authenticated" ? (
        <div className='min-h-screen '>
          <div className="flex flex-col md:flex-row items-center gap-4 p-4 w-full">
            <div className="relative w-full">
              <h4 className='font-semibold'>Profile Url:</h4>
              <Input 
                readOnly
                value={profileUrl}
                className="pr-20 w-full"
              />
              <Button
                className="absolute right-0 top-6"
                onClick={() => {
                  navigator.clipboard.writeText(profileUrl);
                  toast({
                    title: "URL copied to clipboard",
                    duration: 2000
                  });
                }}
                variant="secondary"
              >
                Copy
              </Button>
            </div>
          </div>
          <Separator/>
          <Form {...form}>
            <Form {...form}>
              <form  className="w-full space-y-6">
                <div>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="accept"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center h-full  gap-3  p-3 ">
                         <h4 className='font-bold py-2  text-xl mt-1'>Accepting Messages</h4>
                          <FormControl>
                            <Switch
                              checked={isAcceptingMessages}
                              onCheckedChange={(checked)=>{
                                field.onChange(checked)
                                onSubmit(checked)
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                   
                  </div>
                </div>
              
              </form>
            </Form>
          </Form>
         
          <div className="flex flex-col space-y-4 w-full">
            <h4 className='font-bold py-2 text-xl ml-5'>Your Messages</h4>
            {messages.length < 1 ? 
           ( <div className="text-center text-gray-600">No messages</div>
              
            ) : 
            <div className="flex md:flex-row flex-col items-center p-2 gap-3">
              {messages.map((message,index)=>(
                <MessageCard key={index} message={message} messages={messages} setMessages={setMessages}/>
              ))}
            </div>
            }
          </div>
        </div>
      ) : (
        <>
          <div>please login first </div>
        </>
      )}
    </>
  );
}

export default Page
