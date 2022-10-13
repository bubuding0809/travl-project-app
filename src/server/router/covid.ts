import { createRouter } from "./context";
import { z } from "zod";

export type CovidHistory = {
  month: string;
  dailyAverage: number;
};

export const covidRouter = createRouter()
  .query("getLatestEntryByAlpha3", {
    input: z.object({
      alpha3: z.string().max(3),
    }),
    async resolve({ input, ctx }) {
      if (!input?.alpha3) {
        return null;
      }
      return await ctx.prisma.covid.findFirst({
        where: {
          alpha3: input.alpha3,
        },
        orderBy: {
          entryDate: "desc",
        },
      });
    },
  })
  .query("getMonthWithHighestNewCasesByYear", {
    input: z.object({
      alpha3: z.string().max(3),
      year: z.number().min(2020),
    }),
    async resolve({ input, ctx }) {
      if (!input?.alpha3 || !input?.year) {
        return null;
      }
      return (await ctx.prisma.$queryRaw`
        SELECT MONTHNAME(C.entryDate) AS month, ROUND(AVG(C.newCaseNo)) AS dailyAverage
        FROM Covid C, Country Cn 
        WHERE C.alpha3=Cn.alpha3 AND Cn.alpha3 = ${input.alpha3} AND YEAR(C.entryDate) = ${input.year}
        GROUP BY month 
        ORDER BY dailyAverage DESC
        LIMIT 1;
      `) as CovidHistory[];
    },
  });
