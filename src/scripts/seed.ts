import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import Doc from '../models/Document';
import { connectDB } from '../config/db';

dotenv.config();

const users = [
    {
        username: 'Alice Johnson',
        email: 'alice@example.com',
        password: 'Qwerty@123',
    },
    {
        username: 'Bob Smith',
        email: 'bob@example.com',
        password: 'Qwerty@123',
    },
    {
        username: 'Charlie Brown',
        email: 'charlie@example.com',
        password: 'Qwerty@123',
    },
    {
        username: 'David Lee',
        email: 'david@example.com',
        password: 'Qwerty@123',
    },
    {
        username: 'Eve Wilson',
        email: 'eve@example.com',
        password: 'Qwerty@123',
    }
];

const seedData = async () => {
    try {
        await connectDB();

        console.log('🗑️  Clearing existing data...');
        await User.deleteMany({});
        await Doc.deleteMany({});

        console.log('👤 Creating users...');
        const createdUsers = [];

        for (const userData of users) {
            // We use create to trigger the pre-save hook for password hashing
            const user = await User.create({
                username: userData.username,
                email: userData.email,
                passwordHash: userData.password,
            });
            createdUsers.push(user);
        }

        console.log(`✅ Created ${createdUsers.length} users`);

        console.log('📄 Creating documents...');
        const [alice, bob, charlie, david, eve] = createdUsers;

        const documents = [
            {
                title: 'Project Alpha Proposal',
                content: { ops: [{ insert: 'Project Alpha\n\nObjective: To revolutionize the way we collaborate.\n' }] },
                owner: alice._id,
                collaborators: [bob._id, charlie._id],
            },
            {
                title: 'Q4 Financial Report',
                content: { ops: [{ insert: 'Financial Report Q4\n\nRevenue: $1M\nExpenses: $500k\nProfit: $500k\n' }] },
                owner: bob._id,
                collaborators: [alice._id],
            },
            {
                title: 'Team Meeting Notes',
                content: { ops: [{ insert: 'Meeting Date: Dec 6th\n\nAttendees: Alice, Bob, Charlie\n\nAction Items:\n- Fix bugs\n- Deploy to prod\n' }] },
                owner: charlie._id,
                collaborators: [alice._id, bob._id, david._id, eve._id],
            },
            {
                title: 'Frontend Architecture',
                content: { ops: [{ insert: 'Tech Stack:\n- Next.js\n- TailwindCSS\n- Socket.io\n' }] },
                owner: alice._id,
                collaborators: [],
            },
            {
                title: 'Backend API Specs',
                content: { ops: [{ insert: 'Endpoints:\n- GET /api/docs\n- POST /api/auth\n' }] },
                owner: david._id,
                collaborators: [eve._id],
            }
        ];

        await Doc.insertMany(documents);
        console.log(`✅ Created ${documents.length} documents`);

        console.log('🎉 Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedData();
