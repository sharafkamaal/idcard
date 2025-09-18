import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";
import { User } from "next-auth";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const user : User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not authenticated",
      },
      { status: 401 }
    );
  }

  const userId = user._id; 
  const {acceptmessages} = await request.json();
  
  try {
    await dbConnect();
    const updatedUser = await UserModel.findByIdAndUpdate(userId, { isAcceptingMessages : acceptmessages}, { new: true });
    if (!updatedUser) {
        return Response.json(
            {
                success: false,
                message: "Failed to update user status to accept messages",
            },
            { status: 500 }
        );
    }    
    return Response.json(
        {
            success: true,
            message: "User status updated successfully to accept messages",
        },
        { status: 200 }
    );
  } catch (error) {
    console.log("failed to update user status to accept message");
    return Response.json(
        {
            success: false,
            message: "Failed to update user status to accept messages",
        },
        { status: 500 }
    );
  }
} 
