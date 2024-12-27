import {z} from "zod"


export const messageSchema=z.object({
   content:z.string().min(5,"message should be atleast 5 characters")
})