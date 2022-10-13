import { ReactElement, useRef, useState } from "react";
import Layout from "../components/Layout";
import { NextPageWithLayout } from "./_app";

const ExplorePage: NextPageWithLayout = () => {
  return <main className="flex flex-col gap-2"></main>;
};

export default ExplorePage;

ExplorePage.getLayout = (page: ReactElement) => {
  return <Layout title="Explore">{page}</Layout>;
};
