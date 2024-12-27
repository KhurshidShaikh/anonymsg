import {z} from "zod"


export const signInSchema=z.object({
    identifier:z.string().min(1,"enter your email/username"),
    password:z.string().min(2,"enter your password")
})