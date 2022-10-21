import { ReactElement, useRef, useState } from "react";
import Layout from "../components/Layout";
import { NextPageWithLayout } from "./_app";
import SearchPalette from "../components/home/SearchPalette";
import { CityWithCountry } from "../server/router/city";
import { trpc } from "../utils/trpc";
import { GetServerSideProps } from "next";
import { prisma } from "../server/db/client";
import CovidCard from "../components/home/CovidCard";
import AirTravelCard from "../components/home/AirTravelCard";
import SearchBar from "../components/home/SearchBar";
import HospitalCard from "../components/home/HospitalCard";

type IndexPageProps = {
  randomCity: CityWithCountry;
};

const today = new Date().toISOString().split("T")[0];

const IndexPage: NextPageWithLayout<IndexPageProps> = ({ randomCity }) => {
  const [result, setResult] = useState<CityWithCountry | null>(randomCity);
  const [open, setOpen] = useState(false);
  const [baseValue, setBaseValue] = useState(1);

  const forexQuery = trpc.useQuery([
    "forex.getForexByDate",
    {
      date: new Date(today!),
      currencyBase: "SGD",
      currencyAgainst: result!.isoCode!,
    },
  ]);

  return (
    <main className="flex max-h-screen flex-col gap-2 overflow-y-auto p-4 sm:p-8">
      <SearchPalette setResult={setResult} open={open} setOpen={setOpen} />
      {/* Search bar */}
      <SearchBar open={open} setOpen={setOpen} />
      {/* City information */}
      {result && (
        <div className="grid h-full grid-cols-1 gap-4 p-2 sm:grid-cols-2 lg:grid-cols-3">
          {/* Country information */}
          <div className="flex flex-col rounded-xl bg-slate-50 shadow-md ring ring-gray-200/50 sm:col-span-2">
            <div className="mx-2 mt-2 rounded-lg px-2">City</div>
            <div className="divider my-0 rounded px-2" />
            <div className="flex w-full flex-wrap justify-between gap-2 px-4 pb-4">
              <div className="flex h-auto flex-col self-start">
                <h2 className="text-xl font-bold">{result.cityName}</h2>
                <p className="space-x-1">
                  <span className="text-sm text-gray-500">Country:</span>
                  <span className="text-sm text-gray-900">
                    {result.countryName}
                  </span>
                  <span className="text-sm text-gray-900">{result.alpha3}</span>
                </p>
                <p className="space-x-1">
                  <span className="text-sm text-gray-500">Population:</span>
                  <span className="text-sm text-gray-900">
                    {result.population}
                  </span>
                </p>
                <p className="space-x-1">
                  <span className="text-sm text-gray-500">Region:</span>
                  <span className="text-sm text-gray-900">{result.region}</span>
                </p>
                <p className="space-x-1">
                  <span className="text-sm text-gray-500">Capital type:</span>
                  <span className="text-sm text-gray-900">
                    {result.capital ? result.capital : "Not a capital"}
                  </span>
                </p>
              </div>
              <figure>
                <img
                  src={`https://countryflagsapi.com/png/${result.alpha3}`}
                  className="rounded-lg shadow-md"
                />
              </figure>
            </div>
          </div>

          {/* Currency information */}
          <div className="flex flex-col rounded-xl bg-slate-50 shadow-md ring ring-gray-200/50 sm:col-span-2 md:col-span-1">
            <div className="mx-2 mt-2 flex rounded-lg px-2">
              Currency
              <p className="ml-auto text-xs text-gray-500">
                Last updated:{" "}
                <span className="block font-bold text-gray-900 underline">
                  {new Date(today!).toLocaleDateString("en-SG", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </p>
            </div>
            <div className="divider my-0 rounded px-2" />
            <div className="flex h-full w-full flex-wrap items-start justify-between gap-2 px-4 pb-4">
              <div className="flex h-auto flex-col self-start">
                <h2 className="text-xl font-bold">
                  {
                    forexQuery.data?.Currency_CurrencyToForex_currencyAgainst
                      .currencyName
                  }
                </h2>
              </div>
              <div className="flex w-full items-center justify-between">
                <div className="w-2/5 rounded-md bg-white p-2 text-center font-extrabold shadow-md">
                  <p className="font-normal">SGD</p>
                  <input
                    type="number"
                    className="input w-full text-center"
                    value={baseValue}
                    onChange={e => setBaseValue(Number(e.target.value))}
                    min={0}
                  />
                </div>
                =
                <div className="w-2/5 rounded-md bg-white p-2 text-center font-extrabold shadow-md">
                  <p className="font-normal">{result.isoCode}</p>
                  {forexQuery.data ? (
                    <p>{(forexQuery.data?.rate * baseValue).toFixed(2)}</p>
                  ) : (
                    <p>{result.isoCode === "SGD" ? 1 : "No data"}</p>
                  )}
                </div>
              </div>
              <button className="btn btn-block mt-auto border-none bg-gradient-to-br from-sky-500 to-indigo-500">
                Historical converter
              </button>
            </div>
          </div>

          {/* Covid information */}
          <CovidCard countryAlpha3={result.alpha3} />

          {/* Flight and Aiport information */}
          <AirTravelCard city={result.cid} />

          {/* Hospitals information */}
          <HospitalCard
            city={{
              cid: result.cid,
              cityName: result.cityName,
              latitude: result.latitude!,
              longitude: result.longitude!,
            }}
          />
        </div>
      )}
    </main>
  );
};
export default IndexPage;

export const getServerSideProps: GetServerSideProps = async ctx => {
  const randomCity = (await prisma.$queryRaw`
    SELECT * FROM
    (SELECT C1.cid, C1.cityName, C1.latitude, C1.longitude, C1.capital, C1.population, C1.alpha3 FROM City AS C1 JOIN 
    (SELECT cid FROM City ORDER BY RAND() LIMIT 1) as C2 ON C1.cid=C2.cid) as C3
    JOIN
    Country ON C3.alpha3 = Country.alpha3
  `) as CityWithCountry[];

  return {
    props: {
      randomCity: randomCity[0],
    },
  };
};

IndexPage.getLayout = (page: ReactElement) => {
  return <Layout title="Home">{page}</Layout>;
};
