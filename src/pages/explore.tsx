import { ReactElement, useRef, useState } from "react";
import Layout from "../components/Layout";
import { NextPageWithLayout } from "./_app";

const ExplorePage: NextPageWithLayout = () => {
  return (
    <main className="flex h-full flex-col items-center justify-center gap-2">
      <h1 className="text-4xl font-bold">Work in progress...</h1>
    </main>
  );
};

export default ExplorePage;

ExplorePage.getLayout = (page: ReactElement) => {
  return <Layout title="Explore">{page}</Layout>;
};
