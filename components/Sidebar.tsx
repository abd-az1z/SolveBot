import Link from "next/link";
import { BotMessageSquare, PencilLine, SearchIcon } from "lucide-react";

const Sidebar = () => {
  return (
    <div className="bg-white shadow text-white p-4 px-8">
      <ul className="gap-5 flex lg:flex-col">
        <li className="flex-1">
          <Link
            className="hover:opacity-50 flex flex-col text-center lg:text-left lg:flex-row items-center gap-4 px-4 py-2 rounded-md bg-[#389F37]"
            href="/create-chatbot"
          >
            <BotMessageSquare className="w-6 h-6 lg:h-7 lg:w-7" />
            <div className="hidden md:inline">
              <p className="text-xl">Create</p>
              <p className="text-sm font-extralight">New Bot</p>
            </div>
          </Link>
        </li>
        <li className="flex-1">
          <Link
            className="hover:opacity-50 flex flex-col text-center lg:text-left lg:flex-row items-center gap-4 px-4 py-2 rounded-md bg-[#389F37]"
            href="/view-chatbots"
          >
            <PencilLine className="w-6 h-6 lg:h-7 lg:w-7" />
            <div className="hidden md:inline">
              <p className="text-xl">Edit</p>
              <p className="text-sm font-extralight">Chatbots</p>
            </div>
          </Link>
        </li>
        <li className="flex-1">
          <Link
            className="hover:opacity-50 flex flex-col text-center lg:text-left lg:flex-row items-center gap-4 px-4 py-2 rounded-md bg-[#389F37]"
            href="/review-sessions"
          >
            <SearchIcon className="w-6 h-6 lg:h-7 lg:w-7" />
            <div className="hidden md:inline">
              <p className="text-xl">View</p>
              <p className="text-sm font-extralight">Sessions</p>
            </div>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
