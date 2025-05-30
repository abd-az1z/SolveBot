import Link from "next/link";
import Avatar from "./Avatar";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

const Header = () => {
  return (
    <header className="flex sm:flex-row justify-between items-center gap-10 p-4 shadow bg-white">
      {/* Logo + Title */}
      <Link
        href="/"
        className="flex items-center gap-3 text-start sm:text-left"
      >
        <Avatar
          seed="Solve Bot Support agent"
          className="w-12 h-12 sm:w-14 sm:h-14"
        />
        <div className="space-y-0.5">
          <h1 className="text-2xl sm:text-3xl text-gray-800">SolveBot</h1>
          <p className="text-xs font-light sm:text-sm text-gray-500">
            Your AI-powered customer support agent.
          </p>
        </div>
      </Link>

      {/* Auth Area */}
      <div className="flex items-center text-sm rounded-lg  text-gray-500">
        <SignedIn>
          <UserButton showName />
        </SignedIn>
        <SignedOut>
          <SignInButton />
        </SignedOut>
      </div>
    </header>
  );
};

export default Header;
