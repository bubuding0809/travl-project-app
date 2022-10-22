import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { FlightTicket } from "../../server/router/travel";

type FlightTicketCardProps = {
  data: FlightTicket;
};

const getFlightDuration = (departTime: Date, arriveTime: Date) => {
  const diff = arriveTime.getTime() - departTime.getTime();
  const hours = Math.floor(diff / 1000 / 60 / 60);
  const minutes = Math.floor(diff / 1000 / 60) - hours * 60;
  return `${hours}h ${minutes.toLocaleString("en-SG", {
    minimumIntegerDigits: 2,
  })}`;
};

const FlightTicketCard: React.FC<FlightTicketCardProps> = ({ data }) => {
  return (
    <div className="flex items-center divide-x-2 rounded-xl border shadow-md">
      <div className="ml-6 flex grow items-center">
        <figure>
          <img src="/sia.png" alt="SIA" className="h-auto w-24 " />
        </figure>
        <div className="flex grow items-center justify-center gap-2 p-4">
          <div className="flex flex-col">
            <p>
              {data.departDateTime.getUTCHours().toLocaleString("en-SG", {
                minimumIntegerDigits: 2,
              })}
              :
              {data.departDateTime.getUTCMinutes().toLocaleString("en-SG", {
                minimumIntegerDigits: 2,
              })}
            </p>
            <p>{data.originIata}</p>
          </div>
          <div className="flex grow flex-col pl-4">
            <p className="text-sm">
              {getFlightDuration(data.departDateTime, data.arriveDateTime)}
            </p>
            <hr className="border-1 border-black" />
            <p className="text-sm text-green-600">Direct</p>
          </div>
          <ChevronRightIcon className="h-6 w-6" />
          <div className="flex flex-col">
            <p>
              {data.arriveDateTime.getUTCHours().toLocaleString("en-SG", {
                minimumIntegerDigits: 2,
              })}
              :
              {data.arriveDateTime.getUTCMinutes().toLocaleString("en-SG", {
                minimumIntegerDigits: 2,
              })}
            </p>
            <p>{data.destIata}</p>
          </div>
        </div>
      </div>
      <div className="flex h-full flex-col items-center justify-center gap-1 p-4">
        <p className="font-bold">$USD {data.priceUSD?.toFixed(0)}</p>
        <button className="btn btn-primary btn-sm">Purchase</button>
      </div>
    </div>
  );
};

export default FlightTicketCard;
