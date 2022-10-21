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

const generateRandomClass = () =>
  ["Economy", "Business", "First"][Math.floor(Math.random() * 3)] as
    | "Economy"
    | "Business"
    | "First";
const generateRandomSeat = () => {
  const row = Math.floor(Math.random() * 100);
  const col = "ABCDEFGHJ"[Math.floor(Math.random() * 9)];
  return row + col!;
};
async function main() {
  const tickets = await prisma.ticket_buy.findMany();
  tickets.forEach(async ticket => {
    console.log(
      await prisma.ticket_buy.update({
        where: {
          uid_fid_pid: {
            uid: ticket.uid,
            pid: ticket.pid,
            fid: ticket.fid,
          },
        },
        data: {
          seatNo: generateRandomSeat(),
          class: generateRandomClass(),
        },
      })
    );
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
