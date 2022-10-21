import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import { ReactElement, useEffect, useRef, useState } from "react";
import Layout from "../components/Layout";
import { NextPageWithLayout } from "./_app";
import { unstable_getServerSession as getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { trpc } from "../utils/trpc";
import {
  ChevronRightIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";

const getFlightDuration = (departTime: Date, arriveTime: Date) => {
  const diff = arriveTime.getTime() - departTime.getTime();
  const hours = Math.floor(diff / 1000 / 60 / 60);
  const minutes = Math.floor(diff / 1000 / 60) - hours * 60;
  return `${hours}h ${minutes.toLocaleString("en-SG", {
    minimumIntegerDigits: 2,
  })}`;
};

const TicketsPage: NextPageWithLayout = () => {
  const { data: session } = useSession();
  const [isSticky, setIsSticky] = useState(false);
  const [filterYearMonth, setFilterYearMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const ticketsQuery = trpc.useQuery([
    "ticket.getTicketByUserIdAndYearMonth",
    { userId: session!.user!.id, yearMonth: filterYearMonth },
  ]);

  return (
    <main
      className="flex max-h-screen flex-col gap-4 overflow-y-auto p-4 sm:p-8"
      onScroll={e => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollTop > 100) {
          setIsSticky(true);
        } else {
          setIsSticky(false);
        }
      }}
    >
      <h1 className="text-4xl font-bold">
        <span className="bg-gradient-to-br from-emerald-500 to-indigo-600 bg-clip-text text-transparent">
          {session?.user?.name}
        </span>
        &apos;s tickets
      </h1>
      <div
        className={`sticky top-0 z-10 mt-4 flex flex-col gap-2 transition-all duration-300 ${
          isSticky
            ? "rounded-xl border border-white/30 bg-[#f7f7f7]/50 p-3 shadow-xl backdrop-blur-md"
            : ""
        }`}
      >
        <label htmlFor="filterYearMonth">Filter tickets by month</label>
        <input
          className="input border border-gray-200/50 shadow-md"
          type="month"
          id="filterYearMonth"
          value={filterYearMonth}
          onChange={e => setFilterYearMonth(e.target.value)}
          min="2022-10"
          max="2023-10"
        />
      </div>
      <div className="mb-20 flex flex-col gap-3">
        {ticketsQuery.error && (
          <div className="text-red-500">Something went wrong...</div>
        )}
        {ticketsQuery.isLoading && <p>Loading...</p>}
        {ticketsQuery.data?.length === 0 && (
          <p className="text-sm text-gray-500">No tickets found</p>
        )}
        {ticketsQuery.data?.map((ticket, idx) => (
          <div
            key={idx}
            className="relative flex flex-col rounded-lg border shadow-md"
          >
            <div className="flex justify-between">
              <p className="p-3 px-4">
                {ticket.departDateTime.toLocaleDateString("en-SG", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="p-3 px-4">
                {ticket.arriveDateTime.toLocaleDateString("en-SG", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <div className=" p-2">
              <div className="flex items-center divide-x-2">
                <div className="ml-6 flex grow items-center">
                  <figure>
                    <img src="/sia.png" alt="SIA" className="h-auto w-24 " />
                  </figure>
                  <div className="flex grow items-center justify-center gap-2 p-4">
                    <div className="flex flex-col">
                      <p>
                        {ticket.departDateTime
                          .getUTCHours()
                          .toLocaleString("en-SG", {
                            minimumIntegerDigits: 2,
                          })}
                        :
                        {ticket.departDateTime
                          .getUTCMinutes()
                          .toLocaleString("en-SG", {
                            minimumIntegerDigits: 2,
                          })}
                      </p>
                      <p>{ticket.originIata}</p>
                    </div>
                    <div className="flex w-full items-center">
                      <div className="flex grow flex-col pl-4">
                        <p className="text-sm">
                          {getFlightDuration(
                            ticket.departDateTime,
                            ticket.arriveDateTime
                          )}
                        </p>
                        <hr className="border-1 border-black" />
                        <p className="text-sm text-green-600">Direct</p>
                      </div>
                      <ChevronRightIcon className="h-6 w-6" />
                    </div>
                    <div className="flex flex-col">
                      <p>
                        {ticket.arriveDateTime
                          .getUTCHours()
                          .toLocaleString("en-SG", {
                            minimumIntegerDigits: 2,
                          })}
                        :
                        {ticket.arriveDateTime
                          .getUTCMinutes()
                          .toLocaleString("en-SG", {
                            minimumIntegerDigits: 2,
                          })}
                      </p>
                      <p>{ticket.destIata}</p>
                    </div>
                  </div>
                </div>
                <div className="flex h-full flex-col items-center justify-center gap-1 p-4">
                  <p className="font-bold">
                    $USD {ticket.priceUSD?.toFixed(0)}
                  </p>
                </div>
              </div>
            </div>

            <div className="divider my-0">
              <PaperAirplaneIcon className="h-auto w-20" />
            </div>

            <div className="flex flex-col gap-4 p-2">
              <div className="flex items-center">
                <p className="w-1/2 text-center font-bold">
                  {ticket.originAirportName}
                </p>
                <p className="w-1/2 text-center font-bold">
                  {ticket.destAirportName}
                </p>
              </div>
              <div className="flex justify-evenly gap-2">
                <div className="flex gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Passenger</p>
                    <p className="font-bold">
                      {ticket.lastName} {ticket.firstName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Class</p>
                    <p className="font-bold">{ticket.class}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Seat</p>
                    <p className="font-bold">{ticket.seatNo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Flight</p>
                    <p className="font-bold">{ticket.fid}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default TicketsPage;

export const getServerSideProps: GetServerSideProps = async ctx => {
  return {
    props: {
      session: await getServerSession(ctx.req, ctx.res, authOptions),
    },
  };
};

TicketsPage.getLayout = (page: ReactElement) => {
  return <Layout title="Explore">{page}</Layout>;
};
