import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";
import { User } from "next-auth";

export async function POST(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user = session?.user as User | undefined;

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Not authenticated",
            },
            { status: 401 }
        );
    }

    const userId = (user as any)._id; // if you added _id to session
    const { acceptmessages } = await request.json();

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessage: acceptmessages },
            { new: true }
        );

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
        console.error("Failed to update user status:", error);
        return Response.json(
            {
                success: false,
                message: "Failed to update user status to accept messages",
            },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user = session?.user as User | undefined;

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Not authenticated",
            },
            { status: 401 }
        );
    }

    const userId = (user as any)._id;

    try {
        const foundUser = await UserModel.findById(userId);

        if (!foundUser) {
            return Response.json(
                {
                    success: false,
                    message: "User not found",
                },
                { status: 404 }
            );
        }

        return Response.json(
            {
                success: true,
                isAcceptingMessage: foundUser.isAcceptingMessage,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error while fetching user:", error);
        return Response.json(
            {
                success: false,
                message: "Error getting message acceptance status",
            },
            { status: 500 }
        );
    }
}
