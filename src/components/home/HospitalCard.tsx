import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { Fragment, useEffect, useState } from "react";
import GoogleMapWindow from "../GoogleMapWindow";
import { trpc } from "../../utils/trpc";
import { useDebounce } from "../../utils/hooks/useDebounce";
import { City } from "@prisma/client";

type HospitalCardProps = {
  city: {
    cid: string;
    cityName: string;
    longitude: number;
    latitude: number;
  };
};

const today = new Date();

const HospitalCard: React.FC<HospitalCardProps> = ({ city }) => {
  const [radius, setRadius, debouncedRadius] = useDebounce(5, 250);
  const hospitalsInProximityQuery = trpc.useQuery([
    "hospital.getHospitalsByProximity",
    { cid: city.cid, radius: debouncedRadius * 1000 },
  ]);

  console.log(hospitalsInProximityQuery.data);
  return (
    <div className="flex flex-col rounded-xl bg-slate-50 shadow-md ring ring-gray-200/50 sm:col-span-2 lg:col-span-3">
      <div className="mx-2 mt-2 flex rounded-lg px-2">
        Hospitals
        <p className="ml-auto text-xs text-gray-500">
          Last updated:{" "}
          <span className="block font-bold text-gray-900 underline">
            {today.toLocaleDateString("en-SG", {
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
        <div className="flex w-full items-center gap-2">
          <div className="w-full">
            <input
              onChange={e => setRadius(parseInt(e.target.value))}
              type="range"
              min="5"
              max="100"
              value={radius}
              className="range range-primary range-sm"
              step="1"
            />
            {/* <div className="flex w-full justify-between px-2 text-xs">
              {Array(100)
                .fill(0)
                .map((_, i) => (
                  <span>|</span>
                ))}
            </div> */}
          </div>
          <span>
            <p className="w-22 h-12 rounded-lg bg-white p-2 text-2xl font-bold shadow-md">
              {radius}km
            </p>
          </span>
        </div>
        <GoogleMapWindow
          center={{
            lat: city.latitude,
            lng: city.longitude,
          }}
          hospitals={hospitalsInProximityQuery.data}
          radius={radius}
        />
      </div>
    </div>
  );
};

export default HospitalCard;
