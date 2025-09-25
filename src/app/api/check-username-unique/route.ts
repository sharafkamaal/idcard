import { z } from "zod";
import UserModel from "@/models/user";
import dbConnect from "@/lib/dbConnect";

const UsernameQuerySchema = z.object({
  username: z
    .string()
    .min(2, "Username must be at least 2 characters")
    .max(20, "Username must be no more than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must only contain letters, numbers and underscore")
});

export async function GET(request: Request) {
  if (request.method !== 'GET') {
    return Response.json({
      success: false,
      message: 'Invalid request method'
    }, { status: 405 })
  }

  await dbConnect()
       
  try {
    const {searchParams} = new URL(request.url)
    const queryParam = {
      username: searchParams.get('username')
    }
    
    // validate with zod
    const result = UsernameQuerySchema.safeParse(queryParam)
    console.log(result) //TODO: remove
    
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || []
      return Response.json({
        success: false,
        message: usernameErrors.length > 0
          ? usernameErrors.join(', ')
          : 'Invalid query parameters'
      }, { status: 400 })
    }

    const {username} = result.data 

    const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true})
    if (existingVerifiedUser) {
      return Response.json({
        success: false,
        message: 'Username is already taken'
      }, { status: 400 })
    }
    
    return Response.json({
      success: true,
      message: 'Username is unique'
    }, { status: 200 })
    
  } catch (error) {
    console.error("Error checking username unique", error) 
    return Response.json({
      success: false,
      message: "Error checking username unique"
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  await dbConnect()
       
  try {
    const { username } = await request.json()
    
    // validate with zod
    const result = UsernameQuerySchema.safeParse({ username })
    console.log(result) //TODO: remove
    
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || []
      return Response.json({
        success: false,
        message: usernameErrors.length > 0
          ? usernameErrors.join(', ')
          : 'Invalid request body'
      }, { status: 400 })
    }

    const validatedUsername = result.data.username

    const existingVerifiedUser = await UserModel.findOne({ 
      username: validatedUsername, 
      isVerified: true 
    })
    
    if (existingVerifiedUser) {
      return Response.json({
        success: false,
        message: 'Username is already taken'
      }, { status: 400 })
    }
    
    return Response.json({
      success: true,
      message: 'Username is unique'
    }, { status: 200 })
    
  } catch (error) {
    console.error("Error checking username unique", error) 
    return Response.json({
      success: false,
      message: "Error checking username unique"
    }, { status: 500 })
  }
}