"use client"
import React, { useState } from 'react'
import { useDebounceCallback } from 'usehooks-ts'
import { signInSchema } from '@/schemas/signInSchema'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
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

import { signIn } from 'next-auth/react'
import Link from 'next/link'

const Page = () => {
    const { toast } = useToast()
    const router = useRouter()

    const [username, setUsername] = useState('')
    const [isSubmitting, setisSubmitting] = useState(false)

    const debounce = useDebounceCallback(setUsername, 300)

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: '',
            password: ''
        },
    })




    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        setisSubmitting(true)

        try {
            const result = await signIn('credentials',{
                redirect:false,
                identifier:data.identifier,
                password:data.password
            })
                console.log(result);
                
                if (result?.error) {
                    console.log("Authentication Error:", result.error);
                    toast({
                        title: result.error.includes("Invalid Credentials")
                            ? "Incorrect credentials. Please try again."
                            : result.error,
                        variant: "destructive",
                    });
                    return;
                }

             if(result?.ok){
                console.log("regenerating token");
                
                await fetch("/api/auth/session"); 
                router.push('/dashboard')
             }  
           

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
        <div className=''>
            <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
                <div className="w-full max-w-md  rounded-lg shadow-md p-6 space-y-6">

                    <h2 className=' font-bold text-3xl text-center'>Login to AnonyMsg </h2>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="identifier"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email/Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder="email/username" {...field}
                                            />
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

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <Button 
                        variant="outline" 
                        type="button" 
                        onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                        className="w-full"
                    >
                        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        Sign in with Google
                    </Button>

                    <div>
                        <span className='text-sm font-semibold'>Not Registered yet? <Link href={"/sign-up"} className='text-blue-500'>Register</Link> </span>
                    </div>
                   
                </div>
            </div>
        </div>
    )
}

export default Page
