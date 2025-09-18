import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";

import { Message } from "@/models/user";

export async function POST(request: Request) {
    await dbConnect()

    const { username, content } = await request.json();
    try {
        const user = await UserModel.findOne({ username })
        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                { status: 404 }
            )
        }
        //is user accepting the messages
        if (!)


    } catch (error) {

    }

}
