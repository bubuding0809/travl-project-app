import { createRouter } from "./context";
import { z } from "zod";
import { Airport, Flight } from "@prisma/client";

type AirportAndFlight = Airport & Flight;

export const travelRouter = createRouter()
  .query("getAirportsByCity", {
    input: z.object({
      city: z.string(),
    }),
    async resolve({ input, ctx }) {
      return (await ctx.prisma.$queryRaw`
        SELECT *
        FROM (SELECT * FROM Airport WHERE cid = ${input.city} AND iata IS NOT NULL
                UNION DISTINCT
                SELECT * FROM Airport
                WHERE iata IS NOT NULL
                ORDER BY ST_Distance_Sphere(
                POINT(longitude, latitude),
                POINT((SELECT C1.longitude FROM City C1 WHERE cid = ${input.city}), (SELECT C2.latitude FROM City C2 Where cid = ${input.city}))
            )
        LIMIT 3) as NearByAirports
        LIMIT 10;
      `) as Airport[];
    },
  })
  .query("getFlightsByAirport", {
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
  });
