import { ReactElement, useRef, useState } from "react";
import { useDebounce } from "../utils/hooks/useDebounce";
import Layout from "../components/Layout";
import { NextPageWithLayout } from "./_app";
import SearchPalette from "../components/SearchPalette";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { CityWithCountry } from "../server/router/city";
import { trpc } from "../utils/trpc";
import { GetServerSideProps } from "next";
import { prisma } from "../server/db/client";

type IndexPageProps = {
  randomCity: CityWithCountry;
};

const today = new Date().toISOString().split("T")[0];

const IndexPage: NextPageWithLayout<IndexPageProps> = ({ randomCity }) => {
  const [result, setResult] = useState<CityWithCountry | null>(randomCity);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const inputRef = useRef<HTMLInputElement>(null);

  const forexQuery = trpc.useQuery([
    "forex.getForexByDate",
    {
      date: new Date(today!),
      currencyBase: "SGD",
      currencyAgainst: result!.isoCode!,
    },
  ]);

  const covidQuery = trpc.useQuery([
    "covid.getLatestEntryByAlpha3",
    {
      alpha3: result!.alpha3!,
    },
  ]);

  const covidQueryHistory = trpc.useQuery([
    "covid.getMonthWithHighestNewCasesByYear",
    {
      alpha3: result!.alpha3!,
      year: 2022,
    },
  ]);

  return (
    <main className="flex flex-col gap-2">
      {/* Search bar */}
      <div className="sticky top-0 flex w-full items-center gap-4 rounded-xl border border-white/30 bg-[#f7f7f7]/50 p-3 shadow-xl backdrop-blur-md sm:px-4">
        <div className="hidden flex-col sm:flex">
          <div className="breadcrumbs text-sm">
            <ul>
              <li>
                <a>Pages</a>
              </li>
              <li>
                <a>Home</a>
              </li>
            </ul>
            <h1 className="text-xl font-bold">Home</h1>
          </div>
        </div>
        <div
          className={`relative flex w-full items-center rounded-xl border bg-white px-3 ring ring-offset-2 sm:ml-2 ${
            open ? "ring-indigo-700/30" : "ring-black/5"
          }`}
        >
          <MagnifyingGlassIcon className="h-auto w-6 text-gray-500" />
          <input
            ref={inputRef}
            type="text"
            onChange={event => {
              setDebouncedQuery(event.target.value);
            }}
            className="w-full border-none bg-transparent p-3 text-neutral placeholder-gray-400 focus:ring-0"
            placeholder="Search..."
            onFocus={() => {
              setOpen(true);
              inputRef.current?.blur();
            }}
            value={debouncedQuery}
          />
          <div className="space-x-1">
            <span className="rounded border bg-gray-100 p-1 px-1.5 font-bold shadow-md">
              ⌘
            </span>
            <span className="rounded border bg-gray-100 p-1 px-1.5 font-bold shadow-md">
              K
            </span>
          </div>
        </div>
        <SearchPalette
          open={open}
          query={query}
          debouncedQuery={debouncedQuery}
          setOpen={setOpen}
          setQuery={setQuery}
          setDebouncedQuery={setDebouncedQuery}
          setResult={setResult}
        />
      </div>

      {/* City information */}
      {result && (
        <div className="grid h-full grid-cols-1 gap-4 p-2 sm:grid-cols-2 lg:grid-cols-3">
          {/* Country information */}
          <div className="flex flex-col rounded-xl bg-white shadow-md ring ring-gray-200/50 sm:col-span-2">
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
          <div className="flex flex-col rounded-xl bg-white shadow-md ring ring-gray-200/50">
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
            <div className="flex w-full flex-wrap justify-between gap-2 px-4 pb-4">
              <div className="flex h-auto flex-col self-start">
                <h2 className="text-xl font-bold">
                  {
                    forexQuery.data?.Currency_CurrencyToForex_currencyAgainst
                      .currencyName
                  }
                </h2>
              </div>
              <div className="flex w-full items-center justify-between">
                <div className="w-2/5 rounded-md border p-2 text-center font-extrabold">
                  <p className="font-normal">SGD</p>
                  <p>1</p>
                </div>
                =
                <div className="w-2/5 rounded-md border p-2 text-center font-extrabold">
                  <p className="font-normal">{result.isoCode}</p>
                  {forexQuery.data ? (
                    <p>{forexQuery.data?.rate.toFixed(2)}</p>
                  ) : (
                    <p>{result.isoCode === "SGD" ? 1 : "No data"}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col rounded-xl bg-white shadow-md ring ring-gray-200/50">
            <div className="mx-2 mt-2 flex rounded-lg px-2">
              Covid
              <p className="ml-auto text-xs text-gray-500">
                Last updated:{" "}
                <span className="block font-bold text-gray-900 underline">
                  {covidQuery.data?.entryDate.toLocaleDateString("en-SG", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </p>
            </div>
            <div className="divider my-0 rounded px-2" />

            <div className="flex w-full flex-wrap justify-start gap-4 px-4 pb-4">
              <div>
                <h1>Totals:</h1>
                <h2 className="text-xl font-bold">Infections:</h2>
                <p className="text-xl font-bold text-blue-500">
                  {covidQuery.data?.totalCaseNo}
                </p>
                <h2 className="text-xl font-bold">Deaths:</h2>
                <p className="text-xl font-bold text-red-500">
                  {covidQuery.data?.totalDeathNo}
                </p>
              </div>
              <div>
                <h1>Latest:</h1>
                <h2 className="text-xl font-bold">Infections:</h2>
                <p className="text-xl font-bold text-blue-500">
                  {covidQuery.data?.newCaseNo}
                </p>
                <h2 className="text-xl font-bold">Deaths:</h2>
                <p className="text-xl font-bold text-red-500">
                  {covidQuery.data?.newDeathNo}
                </p>
              </div>
              <div>
                <h1>Historical:</h1>
                <h2 className="text-xl font-bold">
                  Month with highest daily cases:
                </h2>
                <p className="text-xl font-bold text-blue-500">
                  {covidQueryHistory.data &&
                    covidQueryHistory.data![0]!.month + " 2022"}
                </p>
                <h2 className="text-xl font-bold">Daily Average:</h2>
                <p className="text-xl font-bold text-red-500">
                  {covidQueryHistory.data &&
                    covidQueryHistory.data![0]!.dailyAverage}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-green-500 sm:col-span-2"></div>
        </div>
      )}

      {/* <pre>
        <code>{JSON.stringify(covidQueryHistory.data, null, 2)}</code>,{" "}
        <code>{JSON.stringify(covidQuery.data, null, 2)}</code>,{" "}
        <code>{JSON.stringify(result, null, 2)}</code>,{" "}
        <code>{JSON.stringify(forexQuery.data, null, 2)}</code>
      </pre> */}
      {/* Bottom spacer */}
      <div className="p-8"></div>
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
