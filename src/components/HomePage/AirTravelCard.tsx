import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { Fragment, useEffect, useState } from "react";
import { trpc } from "../../utils/trpc";

type AirTravelCardProps = {
  city: string;
};

const today = new Date();
const AirTravelCard: React.FC<AirTravelCardProps> = ({ city }) => {
  const airportQuery = trpc.useQuery([
    "travel.getAirportsByCid",
    { cid: city },
  ]);
  const [selectedAirport, setSelectedAirport] = useState(
    airportQuery.data && airportQuery.data.length > 0
      ? airportQuery.data[0]
      : {
          airportName: "No airport found",
          icao: "",
        }
  );

  useEffect(() => {
    setSelectedAirport(
      airportQuery.data && airportQuery.data.length > 0
        ? airportQuery.data[0]
        : {
            airportName: "No airport found",
            icao: "",
          }
    );
  }, [airportQuery.data]);

  const flightQuery = trpc.useQuery([
    "travel.getFlightsByAirportBeyondDate",
    {
      originAirportIcao: "WSSS",
      destinationAirportIcao: selectedAirport!.icao,
      date: today!,
    },
  ]);

  return (
    <div className="flex flex-col rounded-xl bg-slate-50 shadow-md ring ring-gray-200/50 sm:col-span-2">
      <div className="mx-2 mt-2 flex rounded-lg px-2">
        Air Travel
        <p className="ml-auto text-xs text-gray-500">
          Last updated:{" "}
          <span className="block font-bold text-gray-900 underline">
            {new Date("2022-10-01").toLocaleDateString("en-SG", {
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
        <div className="flex flex-grow flex-col">
          <h1>Airports:</h1>
          <Listbox
            value={selectedAirport}
            onChange={value => {
              setSelectedAirport(value);
            }}
          >
            <div className="relative">
              <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                <span className="block truncate">
                  {selectedAirport?.airportName}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                {airportQuery.data && airportQuery.data.length > 0 ? (
                  <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {airportQuery.data!.map((airport, idx) => (
                      <Listbox.Option
                        key={idx}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active
                              ? "bg-amber-100 text-amber-900"
                              : "text-gray-900"
                          }`
                        }
                        value={airport}
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? "font-medium" : "font-normal"
                              }`}
                            >
                              {airport.airportName}
                            </span>
                            {selected ? (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                <CheckIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                ) : (
                  <div className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    <div className="flex h-full flex-col items-center justify-center">
                      <p className="text-gray-500">No airports</p>
                    </div>
                  </div>
                )}
              </Transition>
            </div>
          </Listbox>
        </div>
        <div className="flex h-full max-h-72 flex-grow flex-col">
          <h1>Flights:</h1>
          <ul className="scroll flex flex-col gap-1 overflow-y-auto rounded-l-lg border p-2 shadow-inner">
            {flightQuery.data &&
              flightQuery.data.map((flight, idx) => {
                return (
                  <li
                    key={idx}
                    className="flex flex-col rounded-lg border bg-white px-2 py-1 shadow-sm"
                  >
                    <p className="text-gray-900">SIN - {flight.iata}</p>
                    <p className="text-gray-500">
                      {flight.departDateTime.toLocaleDateString("en-SG", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                      })}
                      <span className="block font-bold sm:inline"> --- </span>
                      {flight.arriveDateTime.toLocaleDateString("en-SG", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                      })}
                    </p>
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AirTravelCard;
