import { createRouter } from "./context";
import { z } from "zod";
import { City } from "@prisma/client";

export const cityRouter = createRouter()
  .query("getCityByCityName", {
    input: z.object({
      cityName: z.string(),
    }),
    async resolve({ input, ctx }) {
      if (!input?.cityName) {
        return [];
      }
      return await ctx.prisma.city.findMany({
        where: {
          cityName: {
            contains: input?.cityName,
          },
        },
      });
    },
  })
  .query("getCityByFullTextSearch", {
    input: z.object({
      query: z.string(),
    }),
    async resolve({ input, ctx }) {
      if (!input.query) {
        return [];
      }

      return (await ctx.prisma.$queryRaw`
        SELECT *, MATCH(cityName, countryName, alpha3) AGAINST(${input.query}) as relevance
        FROM City
        WHERE MATCH(cityName, countryName, alpha3) AGAINST(${input.query})
        ORDER BY relevance DESC
        LIMIT 25;
      `) as (City & { relevance: number })[];
    },
  });
