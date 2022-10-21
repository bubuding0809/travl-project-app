import { createRouter } from "./context";
import { z } from "zod";
import { Airport, Flight } from "@prisma/client";

export type AirportAndFlight = Airport & Flight;
export type FlightTicket = {
  fid: number;
  departDateTime: Date;
  arriveDateTime: Date;
  originIata: string;
  destIata: string;
  priceUSD: number;
};

export const travelRouter = createRouter()
  .query("getAirportsByCityName", {
    input: z.object({
      cityName: z.string(),
    }),
    async resolve({ input, ctx }) {
      if (!input?.cityName) {
        return [];
      }
      return await ctx.prisma.airport.findMany({
        where: {
          City: {
            cityName: {
              contains: input.cityName,
            },
          },
          iata: {
            not: null,
          },
        },
        select: {
          iata: true,
          icao: true,
          City: {
            select: {
              cityName: true,
              Country: {
                select: {
                  countryName: true,
                },
              },
            },
          },
        },
        take: 25,
      });
    },
  })
  .query("getAirportsByCid", {
    input: z.object({
      cid: z.string(),
    }),
    async resolve({ input, ctx }) {
      return (await ctx.prisma.$queryRaw`
        SELECT *
        FROM (SELECT * FROM Airport WHERE cid = ${input.cid} AND iata IS NOT NULL
                UNION DISTINCT
                SELECT * FROM Airport
                WHERE iata IS NOT NULL
                ORDER BY ST_Distance_Sphere(
                POINT(longitude, latitude),
                POINT((SELECT C1.longitude FROM City C1 WHERE cid = ${input.cid}), (SELECT C2.latitude FROM City C2 Where cid = ${input.cid}))
            )
        LIMIT 3) as NearByAirports
        LIMIT 10;
      `) as Airport[];
    },
  })
  .query("getFlightsByAirportBeyondDate", {
    input: z.object({
      originAirportIcao: z.string(),
      destinationAirportIcao: z.string(),
      date: z.date(),
    }),
    async resolve({ input, ctx }) {
      return (await ctx.prisma.$queryRaw`
        SELECT *
        FROM Flight F, Airport A1, Airport A2
        WHERE F.originAirport = A1.icao AND F.destAirport = A2.icao 
              AND
              F.originAirport = ${input.originAirportIcao} 
              AND 
              F.destAirport = ${input.destinationAirportIcao}
              AND F.departDateTime >= ${input.date}
        ORDER BY F.departDateTime
        LIMIT 25;
      `) as AirportAndFlight[];
    },
  })
  .query("getFlightsByAirportAndDate", {
    input: z.object({
      originAirportIcao: z.string(),
      destinationAirportIcao: z.string(),
      date: z.string(),
    }),
    async resolve({ input, ctx }) {
      return (await ctx.prisma.$queryRaw`
        SELECT F.fid, F.departDateTime, F.arriveDateTime, A1.iata as originIata, A2.iata as destIata, F.priceUSD
        FROM Flight F, Airport A1, Airport A2
        WHERE F.originAirport = A1.icao AND F.destAirport = A2.icao 
              AND
              F.originAirport = ${input.originAirportIcao} 
              AND 
              F.destAirport = ${input.destinationAirportIcao}
              AND DATE(F.departDateTime) = ${input.date}
        ORDER BY F.departDateTime
      `) as FlightTicket[];
    },
  });
