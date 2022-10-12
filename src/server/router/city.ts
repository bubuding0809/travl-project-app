import { createRouter } from "./context";
import { z } from "zod";

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
      return await ctx.prisma.city.findMany({
        where: {
          cityName: {
            search: input.query,
          },
          // Country: {
          //   countryName: {
          //     search: input.query,
          //   },
          // },
        },
      });
    },
  });
