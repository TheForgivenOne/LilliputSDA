import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const prisma = new PrismaClient({
  adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  console.log("🌱 Seeding Lilliput SDA Church database...\n");

  console.log("Clearing existing events and announcements...");
  await prisma.announcement.deleteMany();
  await prisma.event.deleteMany();

  const events = [
    {
      title: "Sabbath Worship Service",
      description: "Join us every Sabbath for uplifting worship, prayer, and inspiring Bible study. Our services include contemporary music, powerful preaching, and opportunities for fellowship.",
      startDate: new Date("2026-04-11T09:30:00"),
      endDate: new Date("2026-04-11T12:00:00"),
      location: "Lilliput SDA Church Main Sanctuary",
      category: "service",
      isRecurring: true,
      recurrencePattern: "weekly",
    },
    {
      title: "Sabbath School",
      description: "Bible study classes for all ages. Adults meet for in-depth Bible study while children enjoy age-appropriate lessons and activities.",
      startDate: new Date("2026-04-11T08:30:00"),
      endDate: new Date("2026-04-11T09:15:00"),
      location: "Lilliput SDA Church",
      category: "service",
      isRecurring: true,
      recurrencePattern: "weekly",
    },
    {
      title: "Adventist Youth Fellowship",
      description: "A vibrant youth group meeting for spiritual growth, fellowship, and service. Join us for worship, discussion, and fun activities.",
      startDate: new Date("2026-04-17T18:00:00"),
      endDate: new Date("2026-04-17T20:00:00"),
      location: "Lilliput SDA Church Youth Hall",
      category: "youth",
    },
    {
      title: "Prayer Meeting",
      description: "Midweek prayer meeting for corporate prayer and spiritual encouragement. All are welcome to join us as we lift up our church and community.",
      startDate: new Date("2026-04-15T19:00:00"),
      endDate: new Date("2026-04-15T20:30:00"),
      location: "Lilliput SDA Church Prayer Room",
      category: "service",
      isRecurring: true,
      recurrencePattern: "weekly",
    },
    {
      title: "Community Outreach - Health Fair",
      description: "Free health screenings, wellness information, and fellowship. Join us as we serve our community with love and care.",
      startDate: new Date("2026-04-19T09:00:00"),
      endDate: new Date("2026-04-19T15:00:00"),
      location: "Lilliput Community Center",
      category: "community",
    },
    {
      title: "Pathfinder Club Meeting",
      description: "Weekly meeting for our Pathfinder club. Fun activities, community service, and spiritual growth for ages 10-17.",
      startDate: new Date("2026-04-18T14:00:00"),
      endDate: new Date("2026-04-18T17:00:00"),
      location: "Lilliput SDA Church",
      category: "youth",
      isRecurring: true,
      recurrencePattern: "weekly",
    },
    {
      title: "LILLIDISCA Camp 2026",
      description: "Annual youth camp experience for spiritual growth, adventure, and fellowship. Five days of fun activities, Bible study, and making lifelong friends.",
      startDate: new Date("2026-07-15T08:00:00"),
      endDate: new Date("2026-07-19T18:00:00"),
      location: "Camp Hope, St. Ann",
      category: "youth",
    },
    {
      title: "Vespers Service",
      description: "An evening of praise, worship, and fellowship. A relaxed atmosphere to end the Sabbath day with song and prayer.",
      startDate: new Date("2026-04-11T18:00:00"),
      endDate: new Date("2026-04-11T19:30:00"),
      location: "Lilliput SDA Church Sanctuary",
      category: "service",
      isRecurring: true,
      recurrencePattern: "weekly",
    },
    {
      title: "Church Board Meeting",
      description: "Monthly church board meeting to discuss church business, budgets, and ministry plans.",
      startDate: new Date("2026-04-14T19:00:00"),
      endDate: new Date("2026-04-14T21:00:00"),
      location: "Lilliput SDA Church Board Room",
      category: "special",
    },
    {
      title: "Global Youth Day Service Project",
      description: "Join youth worldwide in a day of community service. We'll be visiting the elderly, cleaning public spaces, and spreading joy through music.",
      startDate: new Date("2026-03-21T08:00:00"),
      endDate: new Date("2026-03-21T17:00:00"),
      location: "Various Locations in Montego Bay",
      category: "youth",
    },
  ];

  console.log("Creating events...\n");
  for (const event of events) {
    await prisma.event.create({ data: event });
    console.log(`  ✓ ${event.title}`);
  }

  const announcements = [
    {
      title: "Welcome to Lilliput SDA Church",
      content: "We are thrilled to have you visit us today! Lilliput SDA Church is a warm, welcoming community dedicated to following Jesus Christ. Whether you're searching for answers, exploring faith, or just looking for a place to belong, you are welcome here. Please feel free to introduce yourself to our pastor and members after the service. We'd love to get to know you!",
      date: new Date("2026-01-01"),
      category: "general",
      priority: "high",
      isPinned: true,
    },
    {
      title: "Sabbath School Classes Begin at 8:30 AM",
      content: "Reminder: Sabbath School classes begin at 8:30 AM every Saturday. Classes are available for all ages - adults, youth, and children. Please arrive on time to join us for Bible study and fellowship before the worship service.",
      date: new Date("2026-04-05"),
      category: "general",
      priority: "normal",
    },
    {
      title: "Youth Bible Study Series",
      content: "Our youth group is starting a new Bible study series on 'Walking in Faith.' Join us every Friday evening at 6 PM for an engaging study of God's Word, group discussions, and fellowship. Snacks provided!",
      date: new Date("2026-04-01"),
      category: "youth",
      priority: "normal",
    },
    {
      title: "Volunteers Needed for Community Outreach",
      content: "We need volunteers for our upcoming Health Fair community outreach on April 19th. If you have skills in health screening, event setup, or hospitality, please contact the church office. Your service makes a difference!",
      date: new Date("2026-04-03"),
      category: "community",
      priority: "normal",
    },
    {
      title: "VBS Registration Now Open",
      content: "Vacation Bible School registration is now open! This year's theme is 'Explorers Wanted.' Join us July 20-24 for a week of Bible stories, crafts, music, and fun. Register online or at the church office. Early registration gets a free t-shirt!",
      date: new Date("2026-03-15"),
      category: "ministry",
      priority: "normal",
    },
    {
      title: "Midweek Prayer Meeting - Wednesdays at 7 PM",
      content: "Join us every Wednesday at 7 PM for our midweek prayer meeting. This is a time for corporate prayer, praise reports, and spiritual encouragement. All are welcome to join us as we lift up our church, community, and world.",
      date: new Date("2026-04-08"),
      category: "general",
      priority: "normal",
    },
    {
      title: "Pathfinder Club Induction Ceremony",
      content: "Congratulations to our Pathfinders who completed their honors this quarter! The induction ceremony will be held on April 25th during the worship service. Family and friends are invited to celebrate their achievements.",
      date: new Date("2026-04-06"),
      category: "youth",
      priority: "normal",
    },
    {
      title: "Church Directory Update",
      content: "We're updating our church directory! If your contact information has changed, please notify the church office or update your profile on the church app. This helps us stay connected as a community.",
      date: new Date("2026-03-20"),
      category: "general",
      priority: "low",
    },
    {
      title: "Tithe and Offerings",
      content: "Thank you for your faithful giving! You can give online through our website, use the church app, or give in person during the offering time. All donations support our church ministry and community outreach programs.",
      date: new Date("2026-04-01"),
      category: "general",
      priority: "normal",
    },
    {
      title: "LILLIDISCA Camp Registration",
      content: "Don't miss out on LILLIDISCA Camp 2026! This year's camp runs July 15-19. Early bird registration ends April 30th. Camp is for ages 10-17. Contact the youth department for more information or to register.",
      date: new Date("2026-03-25"),
      category: "youth",
      priority: "high",
      isPinned: true,
    },
  ];

  console.log("\nCreating announcements...\n");
  for (const announcement of announcements) {
    await prisma.announcement.create({ data: announcement });
    console.log(`  ✓ ${announcement.title}`);
  }

  console.log("\n✨ Database seeded successfully!");
  console.log(`   - ${events.length} events created`);
  console.log(`   - ${announcements.length} announcements created`);
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
