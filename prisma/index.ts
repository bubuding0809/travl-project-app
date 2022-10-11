import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();

const query = Prisma.sql`SELECT H.hospitalName, C1.cityName, H.address, C2.countryName
                          FROM Hospital H, City C1, Country C2
                          WHERE H.cid = C1.cid AND C1.alpha3=C2.alpha3 AND C1.cityName LIKE 'Beijing'`;

async function main() {
  const beijingHospitals = await prisma.hospital.findMany({
    where: {
      City: {
        cityName: {
          contains: "Beijing",
        },
      },
    },
    include: {
      City: {
        select: {
          Country: {
            select: {
              countryName: true,
              alpha3: true,
            },
          },
        },
      },
    },
  });

  beijingHospitals.forEach(hospital => {
    console.log(hospital);
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
