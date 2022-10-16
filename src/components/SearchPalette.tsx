import { Dialog, Combobox, Transition } from "@headlessui/react";
import {
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { CityWithCountry } from "../server/router/city";
import { trpc } from "../utils/trpc";
import Spinner from "./Spinner";
import { useDebounce } from "../utils/hooks/useDebounce";

type SearchPaletteProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setResult: Dispatch<SetStateAction<any>>;
};
const SearchPalette: React.FC<SearchPaletteProps> = ({
  open,
  setOpen,
  setResult,
}) => {
  const [query, setQuery, debouncedQuery] = useDebounce("", 250);

  console.log(debouncedQuery);
  const {
    data: filteredCities,
    error,
    isFetching,
  } = trpc.useQuery(
    ["city.getCityByFullTextSearch", { query: debouncedQuery }],
    {
      initialData: [],
    }
  );

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

  return (
    <Transition.Root
      show={open}
      as={Fragment}
      afterLeave={() => {
        setQuery("");
      }}
    >
      <Dialog
        onClose={setOpen}
        className="fixed inset-0 z-50 overflow-y-auto p-6 pt-9 sm:pt-[20vh]"
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
              onChange={(city: CityWithCountry) => {
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
                  onChange={event => {
                    setQuery(event.target.value.trim());
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
                    {filteredCities!.map(city => (
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
                              in {city.countryName}
                            </p>
                            <span className="ml-auto mr-2 text-xl">
                              {city.countryFlagEmoji}
                            </span>
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
                        <span className="font-bold">
                          {" "}
                          &quot;New York&quot;{" "}
                        </span>
                        or
                        <span className="font-bold"> &quot;London&quot;</span>
                      </span>
                    </p>
                  </div>
                )}
                {error && (
                  <div>
                    <p className="p-2 px-4 text-start text-gray-500">
                      Something went wrong, please try again later.
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
