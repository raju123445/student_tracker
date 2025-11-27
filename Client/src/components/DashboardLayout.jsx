import SlideBar from "../components/SlideBar.jsx";

const DashboardLayout = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-[#0f172a]">

      {/* Fixed Sidebar */}
      <div className="fixed top-0 left-0 h-full z-50">
        <SlideBar />
      </div>

      {/* Main Page Content */}
      <div className="pl-16 p-6 w-full min-h-screen">
        {children}
      </div>

    </div>
  );
};

export default DashboardLayout;

