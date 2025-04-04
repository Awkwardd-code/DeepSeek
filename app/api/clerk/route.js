import { Webhook } from "svix";
import connectDB from "@/config/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req) {
    // Initialize Svix Webhook using your signing secret
    const wh = new Webhook(process.env.SIGNING_SECRET);
    
    // Retrieve headers directly from the request
    const svixHeaders = {
        "svix-id": req.headers.get("svix-id"),
        "svix-timestamp": req.headers.get("svix-timestamp"),
        "svix-signature": req.headers.get("svix-signature"),
    };

    // Get the payload from the request body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    try {
        // Verify the webhook event and get the event data and type
        const { data, type } = wh.verify(body, svixHeaders);

        // Prepare user data to be stored in MongoDB
        const userData = {
            _id: data.id,  // Clerk's `id` is used as the MongoDB `_id`
            name: `${data.first_name || ""} ${data.last_name || ""}`.trim() || "Unknown",
            email: data.email_addresses?.[0]?.email_address,  // Use the first email address
            image: data.image_url || data.profile_image_url || null,  // Profile image (either in `image_url` or `profile_image_url`)
        };

        // Connect to the database
        await connectDB();

        // Handle events based on the type
        switch (type) {
            case 'user.created':
                // Create new user in the database
                await User.create(userData);
                break;
            case 'user.updated':
                // Update existing user in the database
                await User.findByIdAndUpdate(data.id, userData, { new: true });
                break;
            case 'user.deleted':
                // Delete the user from the database
                await User.findByIdAndDelete(data.id);
                break;
            default:
                // Handle other event types if necessary
                break;
        }

        return NextResponse.json({ message: "Event Received!" });

    } catch (error) {
        console.error("Error processing Svix event:", error);
        return NextResponse.json({ error: "Failed to process event." }, { status: 500 });
    }
}
