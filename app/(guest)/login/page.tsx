import Avatar from "@/components/Avatar";
import { SignIn } from "@clerk/nextjs";

const LoginPage = () => {
  return (
    <div className=" py-10 md:py-0 flex flex-col bg-[#AED580] flex-1 justify-center items-center  ">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col items-center justify-center space-y-5 text-white">
          <div className="rounded-full bg-white p-5 ">
            <Avatar seed="Solvebot" className="w-60 h-60" />
          </div>
          <div className="text-center ">
            <h1 className="text-3xl font-semibold tracking-wider ">SOLVEBOT</h1>
            <h2 className="text-xl">Your AI-powered customer support agent</h2>
            <h3 className="text-md mt-4">Sign in to get started</h3>
          </div>
        </div>
        <SignIn routing="hash" fallbackRedirectUrl="/" />
      </div>
    </div>
  );
};
export default LoginPage;
