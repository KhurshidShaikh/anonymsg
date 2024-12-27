"use client"
import React, { useEffect, useState } from 'react'
import { useDebounceCallback } from 'usehooks-ts'
import { signUpSchema } from '@/schemas/signUpSchema'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import axios from "axios"
import { ApiResponse } from '@/types/ApiResponse'
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"

import { useRouter } from 'next/navigation'


import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

const Page = () => {
  const { toast } = useToast()
  const router = useRouter()

  const [username, setUsername] = useState('')
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [usernameMessage, setUsernameMessage] = useState('')
  const [isSubmitting, setisSubmitting] = useState(false)

  const debounce = useDebounceCallback(setUsername, 300)

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: ""
    },
  })



  useEffect(() => {
    const checkUsername = async () => {
      if (username) {
        setIsCheckingUsername(true)
        try {
          const response = await axios.get<ApiResponse>(`/api/check-username?username=${username}`)

          setUsernameMessage(response.data.message)


        } catch (error) {
          console.log("error while checking username");

        } finally {
          setIsCheckingUsername(false)
        }
      }
    }
    checkUsername()

  }, [username])



  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setisSubmitting(true)
    try {
      const response = await axios.post('/api/sign-up', data)
      toast({
        title: response.data.message
      })

      router.push(`/verify/${username}`)

    } catch (error) {
      console.log('error while submitting form', error);

      toast({
        title: "Failed",
        description: "Something went wrong",
        variant: "destructive"
      })
    } finally {
      setisSubmitting(false)
    }

  }



  return (
    <div className=' min-h-screen'>
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md  rounded-lg shadow-md p-6 space-y-6">

          <h2 className=' font-bold text-3xl text-center'>Welcome to AnonyMsg </h2>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="username" {...field}
                        onChange={(e) => {
                          field.onChange(e)
                          debounce(e.target.value)
                        }}
                      />
                    </FormControl>

                    {usernameMessage && <span className={
                      `${usernameMessage === 'username available'?'text-green-500': 'text-red-500'}`}>
                        {usernameMessage}

                    </span>}
                    {isCheckingUsername && <Loader2 className=' animate-spin' />}

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type='password' placeholder="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isSubmitting}>Submit</Button>
            </form>
          </Form>
          <div>
            <span className='text-sm font-semibold'>Already a member ? <Link href={"/sign-in"} className='text-blue-500'>Login</Link> </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
