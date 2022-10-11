import { ReactElement, useRef, useState } from "react";
import Layout from "../components/Layout";
import { NextPageWithLayout } from "./_app";
import SearchPalette from "../components/SearchPalette";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";

const IndexPage: NextPageWithLayout = () => {
  const [result, setResult] = useState(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <main className="flex flex-col gap-2">
      <div className="relative flex w-full items-center gap-4 rounded-xl border border-white/30 bg-[#f7f7f7]/50 p-3 shadow-xl backdrop-blur-md sm:px-4">
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
          className={`relative flex w-full items-center rounded-xl border bg-white px-3 ring ring-offset-2  sm:ml-2 ${
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
      <div className="mt-10 flex h-full justify-center">
        <pre>
          <code>{JSON.stringify(result, null, 2)}</code>
        </pre>
      </div>
    </main>
  );
};

export default IndexPage;

IndexPage.getLayout = (page: ReactElement) => {
  return <Layout title="Home">{page}</Layout>;
};
