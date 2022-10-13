import { createRouter } from "./context";
import { z } from "zod";
import { City, Country } from "@prisma/client";
import isoCountryCodeToFlagEmoji from "../../utils/helpers/isoCountryCodeToFlagEmoji";

export type CityWithCountry = City & Country;

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

      const results = (await ctx.prisma.$queryRaw`
        SELECT *, MATCH(City.cityName, City.countryName, City.alpha3) AGAINST(${input.query}) as relevance
        FROM City INNER JOIN Country ON City.alpha3 = Country.alpha3
        WHERE MATCH(City.cityName, City.countryName, City.alpha3) AGAINST(${input.query})
        ORDER BY relevance DESC
        LIMIT 25;
      `) as (CityWithCountry & { relevance: number })[];

      return results.map(result => ({
        ...result,
        countryFlagEmoji: isoCountryCodeToFlagEmoji(result.alpha2),
      }));
    },
  });
