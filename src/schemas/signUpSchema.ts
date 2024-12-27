import {z} from "zod"


export const usernameValidation = z.string().min(3,"username should be atleast 3 characters").max(20,"username should not be more than 20 ")

export const signUpSchema=z.object({
    username:usernameValidation,
    email:z.string().email("Invalid Email"),
    password:z.string().min(4,"password should be atleast 4 characters")
})