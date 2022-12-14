import { Dialog, Combobox, Transition } from "@headlessui/react";
import { Dispatch, Fragment, SetStateAction, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { trpc } from "../../utils/trpc";
import Spinner from "../Spinner";
import { useDebounce } from "../../utils/hooks/useDebounce";

type AirportSearchPaletteProps = {
  open: {
    selected: "from" | "to" | null;
    open: boolean;
  };
  setOpen: Dispatch<
    SetStateAction<{
      selected: null | "from" | "to";
      open: boolean;
    }>
  >;
  setResult: {
    setFromAirport: Dispatch<SetStateAction<any>>;
    setToAirport: Dispatch<SetStateAction<any>>;
  };
};
const AirportSearchPalette: React.FC<AirportSearchPaletteProps> = ({
  open,
  setOpen,
  setResult,
}) => {
  const [query, setQuery, debouncedQuery] = useDebounce("", 250);

  const {
    data: filteredAirports,
    isFetching,
    error,
  } = trpc.useQuery([
    "travel.getAirportsByCityName",
    { cityName: debouncedQuery },
  ]);

  return (
    <Transition.Root
      show={open.open}
      as={Fragment}
      afterLeave={() => {
        setQuery("");
      }}
    >
      <Dialog
        onClose={() =>
          setOpen(prev => ({
            ...prev,
            open: false,
          }))
        }
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
              onChange={(airport: any) => {
                setOpen(prev => ({
                  ...prev,
                  open: false,
                }));
                if (open.selected === "from") {
                  setResult.setFromAirport({
                    cityName: airport.City.cityName,
                    icao: airport.icao,
                    iata: airport.iata,
                  });
                } else {
                  setResult.setToAirport({
                    cityName: airport.City.cityName,
                    icao: airport.icao,
                    iata: airport.iata,
                  });
                }
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
                      setOpen(prev => ({
                        ...prev,
                        open: false,
                      }));
                    }
                    setQuery("");
                  }}
                >
                  Esc
                </button>
              </div>

              {/* Filtered search options */}
              <div>
                {filteredAirports && filteredAirports.length > 0 && (
                  <Combobox.Options
                    className="max-h-96 overflow-y-auto p-2"
                    static
                  >
                    {filteredAirports!.map(airport => (
                      <Combobox.Option key={airport.icao} value={airport}>
                        {({ active }) => (
                          <div
                            className={`flex items-center gap-2 rounded-md p-2 ${
                              active ? "bg-primary text-white" : "bg-white"
                            }`}
                          >
                            <p className="font-bold">{airport.City.cityName}</p>
                            <p
                              className={`${
                                active ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              ({airport.iata})
                            </p>
                            <span className="ml-auto mr-2 text-xl">
                              {airport.City.Country.countryName}
                            </span>
                          </div>
                        )}
                      </Combobox.Option>
                    ))}
                  </Combobox.Options>
                )}
                {query &&
                  filteredAirports &&
                  filteredAirports.length === 0 &&
                  !isFetching && (
                    <div>
                      <p className="p-2 px-4 text-start text-gray-500">
                        No results found
                      </p>
                    </div>
                  )}
                {query && isFetching && (
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
                      Search for airports by city name
                      <span className="block">
                        e.g.
                        <span className="font-bold">
                          {" "}
                          &quot;Singapore&quot;{" "}
                        </span>
                        or
                        <span className="font-bold"> &quot;Beijing&quot;</span>
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

export default AirportSearchPalette;
