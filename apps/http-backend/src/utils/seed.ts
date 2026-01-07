import { prisma } from "@repo/prisma/client";

const users = [
  {
    email: "kartik2004210@gmail.com",
    password: "12345678",
    name: "Kartik Bhatt",
    photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTop5JKZBS9D8WnvB9SPH5ZyWuMapENmFV1Zg&s",
  },
  {
    email: "keithwillcode@gmail.com",
    password: "12345678",
    name: "Keith Williams",
    photo: "https://pbs.twimg.com/profile_images/1780922327900860416/fn-A6omG_400x400.jpg",
  },
  {
    email: "mansi@gmail.com",
    password: "12345678",
    name: "Mansi Joshi",
    photo:
      "https://static.vecteezy.com/system/resources/thumbnails/067/673/213/small/buttercup-power-puff-girl-free-vector.jpg",
  },
  {
    email: "karanjoshi@gmail.com",
    password: "12345678",
    name: "Karan Joshi",
    photo:
      "https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0=",
  },
  {
    email: "temp@example.com",
    password: "12345678",
    name: "Temporary User",
    photo:
      "https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0=",
  },
];

export async function seedUsers() {
  console.log("Starting user seed...");

  for (const userData of users) {
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email },
      });

      if (existingUser) {
        console.log(`User ${userData.email} already exists, skipping...`);
        continue;
      }

      const user = await prisma.user.create({
        data: userData,
      });

      console.log(`✓ Created user: ${user.name} (${user.email})`);
    } catch (error) {
      console.error(`✗ Failed to create user ${userData.email}:`, error);
    }
  }

  console.log("User seed completed!");
}

if (require.main === module) {
  seedUsers()
    .catch((error) => {
      console.error("Seed failed:", error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
