import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";
import {z} from "zod";
import { usernameValidation } from "@/schemas/signUpSchemaSchema";
 
const UsernameQuerySchema = z.object({ 
    username : usernameValidation
})

export 