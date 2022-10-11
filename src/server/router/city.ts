import { createRouter } from "./context";
import { z } from "zod";

export const cityRouter = createRouter().query("getCityByCityName", {
  input: z
    .object({
      cityName: z.string(),
    })
    .nullish(),
  resolve({ input, ctx }) {
    if (!input?.cityName) {
      return [];
    }
    return ctx.prisma.city.findMany({
      where: {
        cityName: {
          contains: input?.cityName,
        },
      },
    });
  },
});
