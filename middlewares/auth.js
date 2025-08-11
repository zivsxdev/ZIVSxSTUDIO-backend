import { clerkClient } from "@clerk/express";

export const auth = async (req, res, next) => {
    try {
        // Fix 1: Use req.auth (not await req.auth())
        // Fix 2: Use userId (not userID)
        const { userId, has } = req.auth;
        
        // Check if user is authenticated
        if (!userId) {
            return res.status(401).json({ 
                success: false, 
                message: "Authentication required" 
            });
        }

        const hasPremiumPlan = await has({ plan: 'premium' });
        const user = await clerkClient.users.getUser(userId);

        if (!hasPremiumPlan && user.privateMetadata?.free_usage) {
            req.free_usage = user.privateMetadata.free_usage;
        } else {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: { free_usage: 0 }
            });
            req.free_usage = 0;
        }

        req.plan = hasPremiumPlan ? 'premium' : 'free';
        req.userId = userId; // Add this for use in controllers
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ 
            success: false, 
            message: "Authentication failed: " + error.message 
        });
    }
}