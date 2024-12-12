const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
  try {
    await database.category.createMany({
      data: [
        { name: "এসইও" },
        { name: "লিঙ্ক বিল্ডিং" },
        { name: "কোল্ড ইমেইল" },
        { name: "কনটেণ্ট স্ট্রাটেজি" },
      ],
    });

    console.log("Success");
  } catch (error) {
    console.log("Error seeding the database categories", error);
  } finally {
    await database.$disconnect();
  }
}

main();
