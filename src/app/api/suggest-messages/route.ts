import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Create an asynchronous function POST to handle POST 
// request with parameters request and response.
export async function POST(req:Request) {

    try {
        // Access your API key by creating an instance of GoogleGenerativeAI we'll call it GenAI
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY||"")

        // Ininitalise a generative model
        const model = genAI.getGenerativeModel({ model: "gemini-pro" })

     

        // Define a prompt varibale
        const prompt = `Generate 4 engaging conversation starter messages or questions that would be suitable for an anonymous chat website. The messages should be casual, friendly, and appropriate for general audiences. Format the output as simple || separated sentences. Don't include numbers or bullet points.
        For example:
        How's your day going so far?, What's the most interesting thing that happened to you today?, What's your favorite way to spend a rainy day?`

        // Pass the prompt to the model and retrieve the output
        const result = await model.generateContent(prompt)
        const response = result.response;
        const output = response.text();

        // Send the llm output as a server reponse object
        return NextResponse.json({ output: output })

    } catch (error) {
        console.error(error)
        return NextResponse.json({ success:false,error:error})
    }

}