/**
 * Seed script to populate database with events across all categories
 * Run with: node seedEvents.js
 */

import axios from 'axios';

// Configuration
const API_URL = 'http://localhost:5000/api';
const ADMIN_EMAIL = 'sumitpujari780@klebcahubli.in'; // Update with your admin email
const ADMIN_PASSWORD = '#Yjpvl8cgq@123'; // Update with your admin password

// Events data for all categories
const seedEvents = [
    // TECHNOLOGY EVENTS
    {
        title: 'Tech Conference 2024',
        description: 'Join industry leaders and innovators for a full-day technology conference featuring keynotes, workshops, and networking opportunities. Learn about the latest trends in AI, cloud computing, and cybersecurity from the best minds in tech.',
        date: '2024-03-15',
        time: '09:00',
        location: 'San Francisco Convention Center, CA',
        category: 'Technology',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
        price: 299,
        maxAttendees: 500,
        attendees: 342,
        status: 'Scheduled',
        isFeatured: true,
    },
    {
        title: 'AI & Machine Learning Workshop',
        description: 'Hands-on workshop covering fundamentals of AI and ML. Build real-world projects and learn from industry experts in this intensive full-day session.',
        date: '2024-03-20',
        time: '10:00',
        location: 'Tech Hub, Austin, TX',
        category: 'Technology',
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
        price: 149,
        maxAttendees: 100,
        attendees: 78,
        status: 'Scheduled',
        isFeatured: false,
    },
    {
        title: 'Blockchain & Web3 Summit',
        description: 'Explore the future of decentralized technology with blockchain experts and cryptocurrency pioneers. Network with innovators shaping the future of finance.',
        date: '2024-04-05',
        time: '13:00',
        location: 'Miami Beach Convention Center, FL',
        category: 'Technology',
        image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800',
        price: 399,
        maxAttendees: 300,
        attendees: 0,
        status: 'Scheduled',
        isFeatured: true,
    },

    // BUSINESS EVENTS
    {
        title: 'Startup Pitch Night',
        description: 'Watch innovative startups pitch their ideas to top investors. Network with entrepreneurs and VCs in this exciting evening event filled with innovation and opportunity.',
        date: '2024-03-18',
        time: '18:00',
        location: 'Innovation Hub, New York, NY',
        category: 'Business',
        image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800',
        price: 50,
        maxAttendees: 200,
        attendees: 156,
        status: 'Scheduled',
        isFeatured: false,
    },
    {
        title: 'Leadership & Management Excellence',
        description: 'Two-day intensive program for executives and managers. Learn advanced leadership strategies and team management techniques that drive organizational success.',
        date: '2024-03-25',
        time: '09:00',
        location: 'Boston Business Center, MA',
        category: 'Business',
        image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800',
        price: 599,
        maxAttendees: 150,
        attendees: 134,
        status: 'Scheduled',
        isFeatured: true,
    },
    {
        title: 'Digital Marketing Masterclass',
        description: 'Master the art of digital marketing with SEO, social media, and content marketing strategies that actually work. Get hands-on experience with industry tools.',
        date: '2024-04-10',
        time: '11:00',
        location: 'Seattle Convention Center, WA',
        category: 'Business',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
        price: 199,
        maxAttendees: 250,
        attendees: 0,
        status: 'Scheduled',
        isFeatured: false,
    },

    // MUSIC EVENTS
    {
        title: 'Summer Music Festival 2024',
        description: 'Three days of incredible live music featuring top artists across multiple genres. Food trucks, art installations, and unforgettable performances await in this epic summer celebration!',
        date: '2024-06-15',
        time: '12:00',
        location: 'Central Park, New York, NY',
        category: 'Music',
        image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800',
        price: 250,
        maxAttendees: 5000,
        attendees: 0,
        status: 'Scheduled',
        isFeatured: true,
    },
    {
        title: 'Jazz Night Under the Stars',
        description: 'Intimate jazz performance featuring Grammy-nominated artists in a beautiful outdoor setting. Bring a picnic and enjoy world-class music under the night sky.',
        date: '2024-04-20',
        time: '19:00',
        location: 'Riverfront Amphitheater, Portland, OR',
        category: 'Music',
        image: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800',
        price: 75,
        maxAttendees: 300,
        attendees: 245,
        status: 'Scheduled',
        isFeatured: false,
    },
    {
        title: 'Classical Orchestra Concert',
        description: 'Experience the beauty of classical music performed by a world-renowned symphony orchestra. An evening of timeless masterpieces in an iconic venue.',
        date: '2024-05-05',
        time: '20:00',
        location: 'Carnegie Hall, New York, NY',
        category: 'Music',
        image: 'https://images.unsplash.com/photo-1519683109079-d5f539e1542f?w=800',
        price: 120,
        maxAttendees: 800,
        attendees: 567,
        status: 'Scheduled',
        isFeatured: true,
    },

    // SPORTS EVENTS
    {
        title: 'City Marathon 2024',
        description: 'Join thousands of runners in our annual city marathon. 5K, 10K, and full marathon options available for all fitness levels. Challenge yourself and support local charities!',
        date: '2024-05-12',
        time: '06:00',
        location: 'Downtown City Center, Chicago, IL',
        category: 'Sports',
        image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800',
        price: 45,
        maxAttendees: 3000,
        attendees: 2456,
        status: 'Scheduled',
        isFeatured: true,
    },
    {
        title: 'Basketball Tournament Finals',
        description: 'Watch the championship game of our annual basketball tournament featuring the city\'s best amateur teams. High-energy action and intense competition guaranteed!',
        date: '2024-03-30',
        time: '17:00',
        location: 'Madison Square Garden, New York, NY',
        category: 'Sports',
        image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
        price: 35,
        maxAttendees: 1000,
        attendees: 834,
        status: 'Scheduled',
        isFeatured: false,
    },
    {
        title: 'Yoga & Wellness Retreat',
        description: 'Weekend retreat combining yoga, meditation, and wellness workshops in a peaceful mountain setting. Disconnect, recharge, and find your inner balance.',
        date: '2024-04-25',
        time: '08:00',
        location: 'Mountain View Resort, Denver, CO',
        category: 'Sports',
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
        price: 299,
        maxAttendees: 50,
        attendees: 0,
        status: 'Scheduled',
        isFeatured: false,
    },

    // ARTS EVENTS
    {
        title: 'Modern Art Exhibition',
        description: 'Explore contemporary art from emerging and established artists. Interactive installations, guided tours, and artist meet-and-greets throughout the exhibition.',
        date: '2024-04-08',
        time: '10:00',
        location: 'Museum of Modern Art, San Francisco, CA',
        category: 'Arts',
        image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800',
        price: 25,
        maxAttendees: 500,
        attendees: 0,
        status: 'Scheduled',
        isFeatured: true,
    },
    {
        title: 'Photography Workshop & Gallery',
        description: 'Learn advanced photography techniques from award-winning photographers and showcase your work in our community gallery. All skill levels welcome!',
        date: '2024-05-15',
        time: '14:00',
        location: 'Arts District Gallery, Los Angeles, CA',
        category: 'Arts',
        image: 'https://images.unsplash.com/photo-1452587295999-1a086f6ce977?w=800',
        price: 80,
        maxAttendees: 40,
        attendees: 28,
        status: 'Scheduled',
        isFeatured: false,
    },
    {
        title: 'Theater Performance: Shakespeare Festival',
        description: 'Classic Shakespeare plays performed by a renowned theater company. Three different plays over one weekend - experience timeless drama brought to life!',
        date: '2024-06-01',
        time: '19:30',
        location: 'Globe Theatre, San Diego, CA',
        category: 'Arts',
        image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800',
        price: 55,
        maxAttendees: 400,
        attendees: 0,
        status: 'Scheduled',
        isFeatured: true,
    },

    // EDUCATION EVENTS
    {
        title: 'Code Bootcamp for Beginners',
        description: 'Intensive 2-week coding bootcamp teaching web development fundamentals. No prior experience required - learn HTML, CSS, JavaScript, and React from scratch!',
        date: '2024-04-01',
        time: '09:00',
        location: 'Tech Academy, Seattle, WA',
        category: 'Education',
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
        price: 499,
        maxAttendees: 30,
        attendees: 26,
        status: 'Scheduled',
        isFeatured: true,
    },
    {
        title: 'Financial Literacy Workshop',
        description: 'Learn the basics of personal finance, investing, and wealth building from certified financial planners. Free workshop to help you take control of your financial future!',
        date: '2024-04-18',
        time: '18:00',
        location: 'Community Center, Dallas, TX',
        category: 'Education',
        image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800',
        price: 0,
        maxAttendees: 100,
        attendees: 67,
        status: 'Scheduled',
        isFeatured: false,
    },
    {
        title: 'Science Fair for Kids',
        description: 'Interactive science fair with experiments, demonstrations, and hands-on activities for children ages 6-14. Inspire the next generation of scientists!',
        date: '2024-05-20',
        time: '10:00',
        location: 'Science Museum, Houston, TX',
        category: 'Education',
        image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800',
        price: 15,
        maxAttendees: 200,
        attendees: 0,
        status: 'Scheduled',
        isFeatured: false,
    },

    // HEALTH EVENTS
    {
        title: 'Mental Health Awareness Conference',
        description: 'Join mental health professionals, advocates, and community members for important conversations about mental wellness. Free event supporting mental health awareness.',
        date: '2024-05-10',
        time: '09:00',
        location: 'Health Center, Philadelphia, PA',
        category: 'Health',
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
        price: 0,
        maxAttendees: 300,
        attendees: 189,
        status: 'Scheduled',
        isFeatured: true,
    },
    {
        title: 'Nutrition & Wellness Seminar',
        description: 'Discover the secrets to healthy eating and sustainable lifestyle changes with certified nutritionists. Learn practical tips for better health and vitality.',
        date: '2024-04-22',
        time: '14:00',
        location: 'Wellness Center, Phoenix, AZ',
        category: 'Health',
        image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800',
        price: 35,
        maxAttendees: 80,
        attendees: 54,
        status: 'Scheduled',
        isFeatured: false,
    },
    {
        title: 'Meditation & Mindfulness Retreat',
        description: 'Weekend retreat focused on meditation practices, mindfulness techniques, and stress reduction. Escape the chaos and find peace in a serene mountain setting.',
        date: '2024-06-08',
        time: '08:00',
        location: 'Peaceful Valley Retreat, Sedona, AZ',
        category: 'Health',
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
        price: 250,
        maxAttendees: 40,
        attendees: 0,
        status: 'Scheduled',
        isFeatured: true,
    },

    // FOOD EVENTS
    {
        title: 'Food & Wine Festival',
        description: 'Sample gourmet dishes and fine wines from 50+ local restaurants and wineries. Live cooking demonstrations, tastings, and culinary competitions all day long!',
        date: '2024-05-25',
        time: '16:00',
        location: 'Waterfront Park, San Diego, CA',
        category: 'Food',
        image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
        price: 85,
        maxAttendees: 1000,
        attendees: 0,
        status: 'Scheduled',
        isFeatured: true,
    },
    {
        title: 'Cooking Class: Italian Cuisine',
        description: 'Learn to cook authentic Italian dishes from a professional chef. All ingredients and recipes included - take home new skills and delicious memories!',
        date: '2024-04-12',
        time: '18:00',
        location: 'Culinary Institute, Boston, MA',
        category: 'Food',
        image: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=800',
        price: 95,
        maxAttendees: 20,
        attendees: 17,
        status: 'Scheduled',
        isFeatured: false,
    },
    {
        title: 'Street Food Festival',
        description: 'Experience flavors from around the world at our international street food festival. Over 100 food vendors serving authentic cuisine from every continent!',
        date: '2024-06-20',
        time: '11:00',
        location: 'Downtown Plaza, Portland, OR',
        category: 'Food',
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
        price: 0,
        maxAttendees: 5000,
        attendees: 0,
        status: 'Scheduled',
        isFeatured: true,
    },
];

// Main seed function
async function seedDatabase() {
    try {
        console.log('🌱 Starting database seeding...\n');

        // Step 1: Login as admin
        console.log('🔐 Logging in as admin...');
        const loginResponse = await axios.post(`${API_URL}/auth/login`, {
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD,
        });

        const token = loginResponse.data.token;
        console.log('✅ Admin login successful!\n');

        // Step 2: Create events
        console.log('📅 Creating events...\n');
        let successCount = 0;
        let failCount = 0;

        for (const event of seedEvents) {
            try {
                await axios.post(`${API_URL}/events`, event, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                successCount++;
                console.log(`✓ Created: ${event.title} (${event.category})`);
            } catch (error) {
                failCount++;
                console.error(`✗ Failed: ${event.title} - ${error.response?.data?.message || error.message}`);
            }
        }

        // Summary
        console.log('\n' + '='.repeat(60));
        console.log('🎉 Seeding Complete!');
        console.log('='.repeat(60));
        console.log(`✅ Successfully created: ${successCount} events`);
        console.log(`❌ Failed: ${failCount} events`);
        console.log('\nCategories seeded:');
        const categories = [...new Set(seedEvents.map(e => e.category))];
        categories.forEach(cat => {
            const count = seedEvents.filter(e => e.category === cat).length;
            console.log(`   • ${cat}: ${count} events`);
        });
        console.log('='.repeat(60) + '\n');

    } catch (error) {
        console.error('\n❌ Seeding failed:', error.response?.data?.message || error.message);
        if (error.response?.status === 401) {
            console.error('\n⚠️  Authentication failed. Please check your admin credentials in the script.');
        }
        process.exit(1);
    }
}

// Run the seed function
seedDatabase();
