import React, { ReactNode, useEffect, useState } from "react";
import Head from "next/head";
import { signIn, useSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import { signOut } from "next-auth/react";
import Spinner from "./Spinner";
import Link from "next/link";

type Props = {
  children?: ReactNode;
  title?: string;
};

const Layout = ({ children, title }: Props) => {
  const { data: session, status } = useSession();
  return (
    <>
      <Head>
        <title>{title ?? "Travl page"}</title>
        <meta name="description" content="WCard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-nowrap">
        {/* Sidebar starts */}
        <div className="relative hidden h-screen w-64 flex-col justify-start bg-gray-800 p-2 shadow sm:relative sm:flex">
          {/* Logo */}
          <div className="flex items-center gap-2 border-b border-gray-100/50 p-4">
            <img src="travl-logo-light.png" className="h-auto w-32" />
            {/* <h1 className="bg-gradient-to-r from-emerald-300 to-indigo-500 bg-clip-text font-serif text-4xl font-bold text-transparent">
              travl
            </h1> */}
          </div>

          {/* Sidebar items */}
          <div className="my-2 flex h-full flex-col justify-between p-2">
            <ul>
              <li className="mb-2 flex w-full cursor-pointer items-center justify-start rounded-lg border bg-neutral-focus py-3 px-2 text-gray-300 hover:text-gray-500">
                <img src="home.gif" className="h-auto w-6 rounded-md" />

                <span className="ml-2 text-sm">Home</span>
              </li>
              <li className="mb-2 flex w-full cursor-pointer items-center justify-start py-3 px-2 text-gray-300 hover:text-gray-500">
                <img src="worldwide.gif" className="h-auto w-6 rounded-md" />

                <span className="ml-2 text-sm">Explore</span>
                {/* <div className="flex items-center justify-center rounded bg-gray-700 py-1 px-3 text-xs text-gray-500">
                  5
                </div> */}
              </li>
              <li className="mb-2 flex w-full cursor-pointer items-center justify-start py-3 px-2 text-gray-300 hover:text-gray-500">
                <img src="airplane.gif" className="h-auto w-6 rounded-md" />
                <span className="ml-2 text-sm">Flights</span>
                {/* <div className="flex items-center justify-center rounded bg-gray-700 py-1 px-3 text-xs text-gray-500">
                  5
                </div> */}
              </li>
              <li className="mb-2 flex w-full cursor-pointer items-center justify-start py-3 px-2 text-gray-300 hover:text-gray-500">
                <img src="ticket.gif" className="h-auto w-6 rounded-md" />

                <span className="ml-2 text-sm">Tickets</span>
                {/* <div className="flex items-center justify-center rounded bg-gray-700 py-1 px-3 text-xs text-gray-500">
                  5
                </div> */}
              </li>
            </ul>
            {status === "loading" ? (
              <Spinner />
            ) : session ? (
              <div className="flex flex-col gap-3 rounded-xl bg-gradient-to-br from-emerald-300 to-indigo-500 px-4 py-3">
                <div className="flex gap-2">
                  <div className="avatar">
                    <div className="w-12 rounded-full ring-4 ring-offset-base-100">
                      <img src={session.user!.image!} />
                    </div>
                  </div>
                  <div className="ml-0.5">
                    <h1 className="text-md font-bold text-base-300">
                      {session.user?.name}
                    </h1>
                    <Link href="#">
                      <a className="link link-hover text-sm text-base-300">
                        View profile
                      </a>
                    </Link>
                  </div>
                </div>
                <button
                  className="btn btn-sm border-none bg-white text-slate-900 shadow hover:bg-base-300"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  Sign out
                </button>
              </div>
            ) : (
              <button
                className="btn btn-primary w-full"
                onClick={() => signIn()}
              >
                Login
              </button>
            )}
          </div>

          {/* Bottom nav items */}
          <div className="mt-auto border-t border-gray-700 px-8">
            <ul className="flex w-full items-center justify-between bg-gray-800">
              <li className="cursor-pointer pt-5 pb-3 text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-bell"
                  width={20}
                  height={20}
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" />
                  <path d="M10 5a2 2 0 0 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6" />
                  <path d="M9 17v1a3 3 0 0 0 6 0v-1" />
                </svg>
              </li>
              <li className="cursor-pointer pt-5 pb-3 text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-messages"
                  width={20}
                  height={20}
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" />
                  <path d="M21 14l-3 -3h-7a1 1 0 0 1 -1 -1v-6a1 1 0 0 1 1 -1h9a1 1 0 0 1 1 1v10" />
                  <path d="M14 15v2a1 1 0 0 1 -1 1h-7l-3 3v-10a1 1 0 0 1 1 -1h2" />
                </svg>
              </li>
              <li className="cursor-pointer pt-5 pb-3 text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-settings"
                  width={20}
                  height={20}
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" />
                  <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <circle cx={12} cy={12} r={3} />
                </svg>
              </li>
              <li className="cursor-pointer pt-5 pb-3 text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-archive"
                  width={20}
                  height={20}
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" />
                  <rect x={3} y={4} width={18} height={4} rx={2} />
                  <path d="M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-10" />
                  <line x1={10} y1={12} x2={14} y2={12} />
                </svg>
              </li>
            </ul>
          </div>
        </div>
        {/* Sidebar ends */}

        <div className="container mx-auto w-11/12 py-10 px-6 md:w-4/5">
          <div className="h-full w-full">{children}</div>
        </div>
      </div>
    </>
  );
};

export default Layout;

export const getServerSideProps: GetServerSideProps = async ctx => {
  // const session = await getServerSession(ctx.req, ctx.res, authOptions);

  return {
    props: {
      // session,
    },
  };
};
