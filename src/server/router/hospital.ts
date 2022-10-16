import { createRouter } from "./context";
import { z } from "zod";
import { Hospital } from "@prisma/client";

export type HospitalProximity = Hospital & {
  distance: number;
};
export const hospitalRouter = createRouter()
  .query("getHospitalsByCid", {
    input: z.object({
      cid: z.string(),
    }),
    async resolve({ input, ctx }) {
      return await ctx.prisma.hospital.findMany({
        where: {
          cid: input?.cid,
        },
      });
    },
  })
  .query("getHospitalsByProximity", {
    input: z.object({
      cid: z.string(),
      radius: z.number().min(5000).max(100000),
    }),
    async resolve({ input, ctx }) {
      return (await ctx.prisma.$queryRaw`
        SELECT *, ROUND(ST_DISTANCE_SPHERE(POINT((SELECT longitude FROM City WHERE cid = ${input.cid}), (SELECT latitude FROM City WHERE cid = ${input.cid})), POINT(H.longitude, H.latitude))/1000, 2) as distance
        FROM Hospital H
        WHERE ST_DISTANCE_SPHERE(POINT((SELECT longitude FROM City WHERE cid = ${input.cid}), (SELECT latitude FROM City WHERE cid = ${input.cid})), POINT(H.longitude, H.latitude)) < ${input.radius}
        ORDER BY distance;
      `) as HospitalProximity[];
    },
  });
