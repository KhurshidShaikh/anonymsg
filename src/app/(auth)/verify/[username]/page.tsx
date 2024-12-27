"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useToast } from "@/hooks/use-toast"
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { verifySchema } from "@/schemas/verifySchema"
import axios from "axios"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"


const page = () => {

    const { toast } = useToast()
    const router = useRouter()
    const params=useParams()
   const [isSubmitting, setisSubmitting] = useState(false)
        
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
         code:''
        },
      })


      const onSubmit=async(data: z.infer<typeof verifySchema>)=>{
        setisSubmitting(true)
         try {
         const response= await axios.post(`/api/verify-otp`,{
            username:params.username,
            otp:data.code
         })
         console.log(response.data.success);
         

         toast({
            title: response.data.message
          })

          if(response.data.success==="true"){
            router.push("/sign-in")
          }else{
            router.push(`/verify/${params.username}`)
          }

         } catch (error) {
            console.log('error while submitting otp', error);

            toast({
                title: "Failed",
                description: "Something went wrong",
                variant: "destructive"
            })
         }finally{
            setisSubmitting(false)
         }
         
      }


  return (
    <div className='min-h-screen'>
    <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md  rounded-lg shadow-md p-6 space-y-6">

        <h2 className=' font-bold text-3xl text-center'>Verify your Email </h2>

        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>One-Time Password</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>
                Please enter the one-time password sent to your Email.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
 
        <Button type="submit" disabled={isSubmitting}>Submit</Button>
      </form>
    </Form>
        </div>
      </div>
    </div>
  )
}

export default page
