import { PrismaClient, Prisma } from "@prisma/client";
import { faker } from "@faker-js/faker";
const prisma = new PrismaClient();

const generatePassenger = () => {
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    passportNo: faker.random.alphaNumeric(9).toUpperCase(),
    age: parseInt(faker.random.numeric(2, { allowLeadingZeros: false })),
  };
};
async function main() {
  const users = await prisma.user.findMany();
  const passengers = await prisma.passenger.findMany();
  const flights = await prisma.flight.findMany({
    where: {
      departDateTime: {
        gte: new Date("2023-01-01"),
        lte: new Date("2023-01-25"),
      },
    },
  });

  passengers.forEach(async passenger => {
    const selectedUser = users[Math.floor(Math.random() * users.length)];
    const selectedFlight = flights[Math.floor(Math.random() * flights.length)];
    const flieswith = await prisma.flies_with.create({
      data: {
        fid: selectedFlight!.fid,
        pid: passenger.pid,
      },
    });

    const ticket = await prisma.ticket_buy.create({
      data: {
        fid: selectedFlight!.fid,
        pid: passenger.pid,
        uid: selectedUser!.id,
      },
    });

    console.log(flieswith, ticket);
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
