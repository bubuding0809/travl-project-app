import { createRouter } from "./context";
import { z } from "zod";

export type Ticket = {
  originIata: string;
  originAirportName: string;
  destIata: string;
  destAirportName: string;
  firstName: string;
  lastName: string;
  departDateTime: Date;
  arriveDateTime: Date;
  priceUSD: number;
  fid: string;
  class: string;
  seatNo: string;
};

export const ticketRouter = createRouter().query(
  "getTicketByUserIdAndYearMonth",
  {
    input: z.object({
      userId: z.string(),
      yearMonth: z.string(),
    }),
    async resolve({ input, ctx }) {
      return (await ctx.prisma.$queryRaw`
      SELECT Ao.iata as originIata, Ao.airportName as originAirportName, Ad.iata as destIata, Ad.airportName as destAirportName, P.firstName, P.lastName, F.fid, F.departDateTime, F.arriveDateTime, F.priceUSD, TB.class, TB.seatNo
      FROM Airport Ao, Airport Ad, Flight F, Passenger P, Ticket_buy TB, User U
      WHERE F.originAirport = Ao.icao AND F.destAirport = Ad.icao 
          AND TB.uid = U.id AND TB.fid = F.fid AND TB.pid = P.pid 
          AND U.id = ${input.userId} AND DATE_FORMAT(F.departDateTime, '%Y-%m') = ${input.yearMonth}
      ORDER BY F.departDateTime;
    `) as Ticket[];
    },
  }
);
