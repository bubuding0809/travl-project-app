import { ReactElement, useRef, useState } from "react";
import { useDebounce } from "../utils/hooks/useDebounce";
import Layout from "../components/Layout";
import { NextPageWithLayout } from "./_app";
import SearchPalette from "../components/SearchPalette";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const IndexPage: NextPageWithLayout = () => {
  const [result, setResult] = useState<{ [key: string]: string }>({});
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const inputRef = useRef<HTMLInputElement>(null);

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
      <div className="grid h-full grid-cols-1 gap-2 p-2 sm:grid-cols-2 md:grid-cols-3">
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white p-5 shadow-md ring ring-gray-200/50 sm:col-span-2">
          <div className="flex h-auto flex-col self-start">
            <h1 className="text-2xl font-bold">City</h1>
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
              <span className="text-sm text-gray-900">{result.population}</span>
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
              className="rounded-lg"
            />
          </figure>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white p-5 shadow-md ring ring-gray-200/50">
          <div className="flex h-auto flex-col self-start">
            <h1 className="text-2xl font-bold">Currency</h1>
            <h2 className="text-xl font-bold">{result.currencyName}GPD</h2>
          </div>
          <div className="flex w-full items-center justify-between">
            <div className="w-2/5 rounded-md border p-2 text-center font-extrabold">
              <p className="font-normal">SGD</p>
              <p>1</p>
            </div>
            =
            <div className="w-2/5 rounded-md border p-2 text-center font-extrabold">
              <p className="font-normal">USD</p>
              <p>1.34</p>
            </div>
          </div>
        </div>
        <div className=" bg-green-500"></div>
        <div className=" bg-green-500 sm:col-span-2"></div>
      </div>

      <pre>
        <code>{JSON.stringify(result, null, 2)}</code>
      </pre>
      {/* Bottom spacer */}
      <div className="p-8"></div>
    </main>
  );
};

export default IndexPage;

IndexPage.getLayout = (page: ReactElement) => {
  return <Layout title="Home">{page}</Layout>;
};
