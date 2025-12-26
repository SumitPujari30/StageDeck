/**
 * Script to update all pending users to approved status
 * Run with: node updateUserApproval.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

// Load env vars
dotenv.config();

async function updateUsers() {
    try {
        // Connect to database
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected\n');

        // Update all pending users to approved
        const result = await User.updateMany(
            { approvalStatus: 'pending', role: 'user' },
            {
                $set: {
                    approvalStatus: 'approved',
                    approvedAt: new Date()
                }
            }
        );

        console.log('📊 Update Results:');
        console.log(`   Modified: ${result.modifiedCount} users`);
        console.log(`   Matched: ${result.matchedCount} users\n`);

        // Show updated users
        const approvedUsers = await User.find({
            approvalStatus: 'approved',
            role: 'user'
        }).select('name email approvalStatus');

        console.log('✅ Approved Users:');
        approvedUsers.forEach(user => {
            console.log(`   • ${user.name} (${user.email})`);
        });

        console.log('\n✨ All users are now approved and can book events!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

updateUsers();
