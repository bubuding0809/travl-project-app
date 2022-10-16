import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Dispatch, SetStateAction } from "react";

type SearchBarProps = {
  innerRef: React.RefObject<HTMLInputElement>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};
const SearchBar: React.FC<SearchBarProps> = ({ innerRef, setOpen, open }) => {
  return (
    <div className="sticky top-0 z-10 flex w-full items-center gap-4 rounded-xl border border-white/30 bg-[#f7f7f7]/50 p-3 shadow-xl backdrop-blur-md sm:px-4">
      <div className="hidden flex-col sm:flex">
        <div className="breadcrumbs text-sm">
          <ul>
            <li>
              <a>Pages</a>
            </li>
            <li>
              <a>Home</a>
            </li>
          </ul>
          <h1 className="text-xl font-bold">Home</h1>
        </div>
      </div>
      <div
        className={`relative flex w-full items-center rounded-xl border bg-white px-3 ring ring-offset-2 sm:ml-2 ${
          open ? "ring-indigo-700/30" : "ring-black/5"
        }`}
      >
        <MagnifyingGlassIcon className="h-auto w-6 text-gray-500" />
        <input
          ref={innerRef}
          type="text"
          className="w-full border-none bg-transparent p-3 text-neutral placeholder-gray-400 focus:ring-0"
          placeholder="Search..."
          onFocus={() => {
            setOpen(true);
            innerRef.current?.blur();
          }}
        />
        <div className="space-x-1">
          <span className="rounded border bg-gray-100 p-1 px-1.5 font-bold shadow-md">
            ⌘
          </span>
          <span className="rounded border bg-gray-100 p-1 px-1.5 font-bold shadow-md">
            K
          </span>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
