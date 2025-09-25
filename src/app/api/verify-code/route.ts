import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";

export async function POST(request: Request) {
  try {
    await dbConnect();

    const { username, code } = await request.json();
    console.log("🔍 Received verification request:", { username, code });

    // Normalize input
    const identifier = decodeURIComponent(username || "").trim().toLowerCase();

    // Try finding user by username OR email
    const user = await UserModel.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });

    console.log("🔍 User found:", !!user);

    if (!user) {
      console.log("❌ User not found in database");
      return Response.json(
        { success: false, message: "User not found. Please sign up again." },
        { status: 404 }
      );
    }

    console.log("✅ User found, checking verification code...");
    console.log("🔢 Stored code:", user.verifyCode);
    console.log("🔢 Provided code:", code);
    console.log("⏰ Code expiry:", user.verifyCodeExpiry);
    console.log("⏰ Current time:", new Date());

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();

      console.log("🎉 User verified successfully!");
      return Response.json(
        { success: true, message: "Account verified successfully" },
        { status: 200 }
      );
    }

    if (!isCodeNotExpired) {
      console.log("⏰ Verification code expired");
      return Response.json(
        { success: false, message: "Verification code expired. Please request a new one." },
        { status: 400 }
      );
    }

    console.log("❌ Incorrect verification code");
    return Response.json(
      { success: false, message: "Incorrect verification code" },
      { status: 400 }
    );
  } catch (error) {
    console.error("❌ Error verifying user:", error);
    return Response.json(
      { success: false, message: "Error verifying user" },
      { status: 500 }
    );
  }
}
