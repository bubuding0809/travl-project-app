import { ReactElement, useRef, useState } from "react";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Layout from "../../components/Layout";
import { NextPageWithLayout } from "../_app";
import AirportSearchPalette from "../../components/Flights/AirportSearchPalette";
import { trpc } from "../../utils/trpc";
import FlightTicketCard from "../../components/Flights/FlightTicketCard";

const today = new Date().toISOString().split("T")[0];

const FlightsPage: NextPageWithLayout = () => {
  const [flightFromData, setFlightFormData] = useState({
    type: "roundtrip",
    from: {
      cityName: "Singapore",
      icao: "WSSS",
      iata: "SIN",
    },
    to: {
      cityName: "Beijing",
      icao: "ZBAA",
      iata: "PEK",
    },
    depart: today,
    return: today,
    passengers: 1,
  });

  const [open, setOpen] = useState<{
    selected: "from" | "to" | null;
    open: boolean;
  }>({
    selected: null,
    open: false,
  });

  const handleFlightFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "return" && value < flightFromData!.depart!) {
      setFlightFormData(prev => ({
        ...prev,
        depart: value,
        return: value,
      }));
    }

    setFlightFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFlightSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const departureFlightQuery = trpc.useQuery([
    "travel.getFlightsByAirportAndDate",
    {
      originAirportIcao: flightFromData.from.icao,
      destinationAirportIcao: flightFromData.to.icao,
      date: flightFromData.depart!,
    },
  ]);
  const returnFlightQuery = trpc.useQuery([
    "travel.getFlightsByAirportAndDate",
    {
      originAirportIcao: flightFromData.to.icao,
      destinationAirportIcao: flightFromData.from.icao,
      date: flightFromData.return!,
    },
  ]);

  return (
    <main className="flex flex-col justify-center gap-2 ">
      <AirportSearchPalette
        open={open}
        setOpen={setOpen}
        setResult={{
          setFromAirport: airport => {
            setFlightFormData(prev => ({
              ...prev,
              from: airport,
            }));
          },
          setToAirport: airport => {
            setFlightFormData(prev => ({
              ...prev,
              to: airport,
            }));
          },
        }}
      />
      <h1 className="text-4xl font-bold">Travel to wonders</h1>
      <form
        className="flex w-full flex-col items-start rounded-xl border border-white/30 bg-[#f7f7f7]/50 p-3 shadow-xl backdrop-blur-md sm:px-4"
        onSubmit={handleFlightSearch}
      >
        <div className="flex gap-2">
          <div className="form-control">
            <label className="label cursor-pointer gap-1">
              <input
                type="radio"
                name="type"
                className="radio"
                value="roundtrip"
                checked={flightFromData.type === "roundtrip"}
                onChange={handleFlightFormChange}
              />
              <span className="label-text">Round-trip</span>
            </label>
          </div>
          <div className="form-control">
            <label className="label cursor-pointer gap-1">
              <input
                type="radio"
                name="type"
                className="radio"
                value="oneway"
                checked={flightFromData.type === "oneway"}
                onChange={handleFlightFormChange}
              />
              <span className="label-text">One-way</span>
            </label>
          </div>
        </div>
        <div className="col grid w-full grid-cols-12 items-stretch gap-2">
          <div className="col-span-12 grid grid-cols-2 gap-1 lg:col-span-6">
            <div className="form-control col-span-2 md:col-span-1">
              <label className="label">
                <span className="label-text">From</span>
              </label>
              <input
                type="text"
                placeholder="Search for a city"
                className="input input-bordered"
                onClick={() => setOpen({ selected: "from", open: true })}
                value={
                  flightFromData.from.cityName
                    ? `${flightFromData.from.cityName} (${flightFromData.from.iata})`
                    : ""
                }
                onChange={() => {
                  return;
                }}
              />
            </div>
            <div className="form-control col-span-2 md:col-span-1">
              <label className="label">
                <span className="label-text">To</span>
              </label>
              <input
                type="text"
                placeholder="Search for a city"
                className="input input-bordered"
                onClick={() => setOpen({ selected: "to", open: true })}
                value={
                  flightFromData.to.cityName
                    ? `${flightFromData.to.cityName} (${flightFromData.to.iata})`
                    : ""
                }
                onChange={() => {
                  return;
                }}
              />
            </div>
          </div>
          <div className="col-span-12 grid grid-cols-2 gap-1 lg:col-span-6">
            <div className="form-control col-span-2 sm:col-span-1">
              <label className="label">
                <span className="label-text">Departure</span>
              </label>
              <input
                type="date"
                placeholder="Country or city"
                className="input input-bordered"
                value={flightFromData.depart}
                name="depart"
                onChange={handleFlightFormChange}
                min={today}
                max={"2023-10-01"}
              />
            </div>
            <div className="form-control col-span-2 sm:col-span-1">
              <label className="label">
                <span className="label-text">Return</span>
              </label>
              <input
                type="date"
                placeholder="Country or city"
                className={`input input-bordered ${
                  flightFromData.type === "oneway" ? "input-disabled" : ""
                }`}
                value={flightFromData.return}
                name="return"
                onChange={handleFlightFormChange}
                min={today}
                max={"2023-10-01"}
              />
            </div>
          </div>
          {/* <div className="col-span-12 mt-2 flex flex-wrap justify-between lg:mt-0">
            <div className="form-control">
              <label className="label cursor-pointer gap-1 ">
                <span className="label-text">Passengers</span>
              </label>
              <input
                type="number"
                className="input input-bordered text-center"
                max={10}
                min={1}
                value={flightFromData.passengers}
                name="passengers"
                onChange={handleFlightFormChange}
              />
            </div>
            <button className="btn btn-primary mt-auto w-56">
              Search Flights
              <ArrowRightIcon className="ml-2 h-auto w-5" />
            </button>
          </div> */}
        </div>
      </form>

      {/* Search Results */}
      <div className="mt-6 flex w-full flex-col items-center gap-2">
        <div className="grid w-full grid-cols-2 justify-between gap-2">
          <div
            className={`col-span-2 flex flex-col gap-2 ${
              flightFromData.type !== "roundtrip"
                ? "lg:col-span-2"
                : "lg:col-span-1"
            }`}
          >
            <h3 className="text-xl font-bold">Departure</h3>
            {departureFlightQuery.data?.map(flight => (
              <FlightTicketCard data={flight} key={flight.fid} />
            ))}
          </div>
          {flightFromData.type === "roundtrip" && (
            <div className="col-span-2 flex flex-col gap-2 lg:col-span-1">
              <h3 className="text-xl font-bold">Return</h3>
              {returnFlightQuery.data?.map(flight => (
                <FlightTicketCard data={flight} key={flight.fid} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default FlightsPage;

FlightsPage.getLayout = (page: ReactElement) => {
  return <Layout title="Explore">{page}</Layout>;
};
