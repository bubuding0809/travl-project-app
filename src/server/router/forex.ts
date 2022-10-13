import { createRouter } from "./context";
import { z } from "zod";

export const forexRouter = createRouter().query("getForexByDate", {
  input: z.object({
    date: z.date(),
    currencyBase: z.string().max(3),
    currencyAgainst: z.string().max(3),
  }),
  async resolve({ input, ctx }) {
    console.log(input.date.toISOString());
    const result = await ctx.prisma.forex.findFirst({
      where: {
        entryDate: input.date,
        currencyBase: input.currencyBase,
        currencyAgainst: input.currencyAgainst,
      },
      include: {
        Currency_CurrencyToForex_currencyAgainst: true,
      },
    });

    if (result) {
      console.log("FOUND RESULT");
      return result;
    }

    // TODO: implement forex api call
    try {
      const response = await fetch(
        `https://api.exchangerate.host/convert?from=${input.currencyBase}&to=${
          input.currencyAgainst
        }&date=${input.date.toISOString()}`
      );
      const data = await response.json();

      if (data.success) {
        return await ctx.prisma.forex.create({
          data: {
            entryDate: input.date,
            currencyBase: input.currencyBase,
            currencyAgainst: input.currencyAgainst,
            rate: data.result,
          },
          include: {
            Currency_CurrencyToForex_currencyAgainst: true,
          },
        });
      }
    } catch (error) {
      return null;
    }
  },
});
