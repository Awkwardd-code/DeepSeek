import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        name: v.string(),
        email: v.string(),
        image: v.optional(v.string()),
        clerkId: v.string(),
    }).index("by_clerk_id", ["clerkId"]),


    conversations: defineTable({
        name: v.string(),
        messages: v.array(
            v.object({
                role: v.string(),
                content: v.string(),
                timestamp: v.number(),
            })
        ),
        userId: v.string(),
    }).index("by_user", ["userId"]), // Example index for querying by user

});