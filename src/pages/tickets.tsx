import { ReactElement, useRef, useState } from "react";
import Layout from "../components/Layout";
import { NextPageWithLayout } from "./_app";

const TicketsPage: NextPageWithLayout = () => {
  return <main className="flex flex-col gap-2"></main>;
};

export default TicketsPage;

TicketsPage.getLayout = (page: ReactElement) => {
  return <Layout title="Explore">{page}</Layout>;
};
