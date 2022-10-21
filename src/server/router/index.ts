// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { exampleRouter } from "./example";
import { covidRouter } from "./covid";
import { cityRouter } from "./city";
import { forexRouter } from "./forex";
import { travelRouter } from "./travel";
import { hospitalRouter } from "./hospital";
import { ticketRouter } from "./ticket";
import { protectedExampleRouter } from "./protected-example-router";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("example.", exampleRouter)
  .merge("auth.", protectedExampleRouter)
  .merge("city.", cityRouter)
  .merge("forex.", forexRouter)
  .merge("covid.", covidRouter)
  .merge("travel.", travelRouter)
  .merge("hospital.", hospitalRouter)
  .merge("ticket.", ticketRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
