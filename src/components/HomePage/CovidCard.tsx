import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { Fragment, useState } from "react";
import { trpc } from "../../utils/trpc";

type CovidCardProps = {
  countryAlpha3: string;
};

const availableYears = [2020, 2021, 2022];

const CovidCard: React.FC<CovidCardProps> = ({ countryAlpha3 }) => {
  const [selectedYear, setSelectedYear] = useState(
    availableYears[availableYears.length - 1]!
  );
  const covidQuery = trpc.useQuery([
    "covid.getLatestEntryByAlpha3",
    {
      alpha3: countryAlpha3,
    },
  ]);

  const covidQueryHistory = trpc.useQuery([
    "covid.getMonthWithHighestNewCasesByYear",
    {
      alpha3: countryAlpha3,
      year: selectedYear,
    },
  ]);

  return (
    <div className="flex flex-col rounded-xl bg-slate-50 shadow-md ring ring-gray-200/50 sm:col-span-2 md:col-span-1">
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
        {/* Total data */}
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

        {/* Latest data */}
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

        {/* Historical data */}
        <div className="w-full">
          <div className="flex items-center gap-2 bg-center p-1">
            <h1>Historical:</h1>
            <Listbox value={selectedYear} onChange={setSelectedYear}>
              <div className=" relative w-24">
                <Listbox.Button className=" relative w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                  <span className="block truncate">{selectedYear}</span>
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
                  <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {availableYears.map((year, idx) => (
                      <Listbox.Option
                        key={idx}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active
                              ? "bg-amber-100 text-amber-900"
                              : "text-gray-900"
                          }`
                        }
                        value={year}
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? "font-medium" : "font-normal"
                              }`}
                            >
                              {year}
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
                </Transition>
              </div>
            </Listbox>
          </div>
          {covidQueryHistory.data ? (
            <div>
              <h2 className="text-xl font-bold">
                Month with highest daily cases:
              </h2>
              <p className="text-xl font-bold text-blue-500">
                {covidQueryHistory.data &&
                  covidQueryHistory.data.month + " 2022"}
              </p>
              <h2 className="text-xl font-bold">Daily Average:</h2>
              <p className="text-xl font-bold text-red-500">
                {covidQueryHistory.data && covidQueryHistory.data.dailyAverage}
              </p>
            </div>
          ) : (
            <p className="text-xl font-bold text-red-500">
              No data for {selectedYear}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CovidCard;
