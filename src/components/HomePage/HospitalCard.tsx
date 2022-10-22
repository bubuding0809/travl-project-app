import GoogleMapWindow from "../GoogleMapWindow";
import { trpc } from "../../utils/trpc";
import { useDebounce } from "../../utils/hooks/useDebounce";

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

  return (
    <div className="flex flex-col rounded-xl bg-slate-50 shadow-md ring ring-gray-200/50 sm:col-span-2 lg:col-span-3">
      {/* Card header */}
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

      {/* Card body */}
      <div className="flex w-full flex-wrap justify-start gap-4 px-4 pb-4">
        <div className="flex w-full items-center gap-2">
          <div className="w-full">
            <h1 className="font-bold">Radius</h1>
            <input
              onChange={e => setRadius(parseInt(e.target.value))}
              type="range"
              min="5"
              max="99"
              value={radius}
              className="range range-primary range-sm"
              step="1"
            />
          </div>
          <span>
            <p className="h-12 w-20 rounded-lg bg-white py-2.5 text-center text-lg font-bold shadow-md">
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
