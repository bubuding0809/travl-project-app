import { Dialog, Combobox, Transition } from "@headlessui/react";
import {
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import cityList from "../data/cities.json";
import { trpc } from "../utils/trpc";
import Spinner from "./Spinner";

type SearchPaletteProps = {
  open: boolean;
  query: string;
  debouncedQuery: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setQuery: Dispatch<SetStateAction<string>>;
  setDebouncedQuery: Dispatch<SetStateAction<string>>;
  setResult: Dispatch<SetStateAction<any>>;
};
const SearchPalette: React.FC<SearchPaletteProps> = ({
  open,
  query,
  debouncedQuery,
  setOpen,
  setQuery,
  setDebouncedQuery,
  setResult,
}) => {
  const initalRef = useRef<HTMLInputElement>(null);
  const {
    data: filteredCities,
    error,
    isFetching,
    isLoading,
  } = trpc.useQuery(["city.getCityByFullTextSearch", { query }], {
    initialData: [],
  });

  // Add key down listener to window
  useEffect(() => {
    // get window to listen to keydown events
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.ctrlKey || event.metaKey)) {
        setOpen(prevState => !prevState);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  // Debounce query
  useEffect(() => {
    const timeout = setTimeout(() => {
      setQuery(debouncedQuery);
    }, 300);

    return () => {
      clearTimeout(timeout);
    };
  }, [debouncedQuery]);

  return (
    <Transition.Root
      show={open}
      as={Fragment}
      afterLeave={() => {
        setDebouncedQuery("");
        setQuery("");
      }}
    >
      <Dialog
        initialFocus={initalRef}
        onClose={setOpen}
        className="fixed inset-0 overflow-y-auto p-6 pt-9 sm:pt-[20vh]"
      >
        {/* Overlay */}
        <Transition.Child
          as={Fragment}
          enter="duration-300 ease-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="duration-200 ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-600/30 backdrop-blur-sm" />
        </Transition.Child>

        {/* Search combobox */}
        <Transition.Child
          as={Fragment}
          enter="duration-300 ease-out"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="duration-200 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-75"
        >
          <Dialog.Panel className="relative mx-auto max-w-xl rounded-xl border bg-white shadow-2xl ring ring-indigo-700/30 ring-offset-2">
            <Combobox
              onChange={city => {
                setOpen(false);
                setResult(city);
              }}
              as="div"
              className="divide-y"
            >
              {/* Search input */}
              <div className="flex items-center px-3">
                <MagnifyingGlassIcon className="h-6 w-6 flex-grow text-gray-500" />
                <Combobox.Input
                  ref={initalRef}
                  onChange={event => {
                    const query = event.target.value.trim();
                    setDebouncedQuery(query);
                  }}
                  className="w-full border-none bg-transparent p-3 text-neutral placeholder-gray-400 focus:ring-0"
                  placeholder="Search..."
                />
                <button
                  className="rounded border bg-gray-100 p-1 px-1.5 font-bold shadow-md"
                  onClick={() => {
                    if (!debouncedQuery) {
                      setOpen(false);
                    }
                    setDebouncedQuery("");
                    setQuery("");
                  }}
                >
                  Esc
                </button>
              </div>

              {/* Filtered search options */}
              <div>
                {filteredCities!.length > 0 && (
                  <Combobox.Options
                    className="max-h-96 overflow-y-auto p-2"
                    static
                  >
                    {filteredCities!.slice(0, 20).map(city => (
                      <Combobox.Option key={city.cid} value={city}>
                        {({ active }) => (
                          <div
                            className={`flex items-center gap-2 rounded-md p-2 ${
                              active ? "bg-primary text-white" : "bg-white"
                            }`}
                          >
                            <p className="font-bold">{city.cityName}</p>
                            <p
                              className={`${
                                active ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              in {city.alpha3}
                            </p>
                          </div>
                        )}
                      </Combobox.Option>
                    ))}
                  </Combobox.Options>
                )}
                {query && filteredCities!.length === 0 && !isFetching && (
                  <div>
                    <p className="p-2 px-4 text-start text-gray-500">
                      No results found
                    </p>
                  </div>
                )}
                {query && filteredCities!.length === 0 && isFetching && (
                  <div className="flex items-center">
                    <p className="p-2 px-4 text-start text-gray-500">
                      Loading results...
                    </p>
                    <Spinner />
                  </div>
                )}
                {!query && (
                  <div>
                    <p className="p-2 px-4 text-start text-gray-500">
                      Start by typing a city name
                      <span className="block">
                        e.g.
                        <span className="font-bold"> &quot;New York&quot;</span>
                        or
                        <span className="font-bold"> &quot;London&quot;</span>
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </Combobox>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  );
};

export default SearchPalette;
