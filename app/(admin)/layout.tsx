import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

const AdminLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
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
};

export default AdminLayout;