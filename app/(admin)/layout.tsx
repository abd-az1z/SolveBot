import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col flex-1 ">
      {/* Header */}
      <Header />

      {/* Content Area */}
      <div className="flex flex-col md:flex-row flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex flex-1 justify-center p-4">
          <div className="w-full max-w-3xl  ">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
