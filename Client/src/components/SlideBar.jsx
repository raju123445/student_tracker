import {
    BookOpen,
    Building2,
    LayoutDashboard,
    Search,
    Settings,
    Users,
} from "lucide-react";
import { useState } from "react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menus = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      link: "/dashboard",
    },
    { name: "USN Search", icon: <Search size={20} />, link: "/tracking" },
    {
      name: "Course Search",
      icon: <BookOpen size={20} />,
      link: "/course-search",
    },

    // --- You can add more items ---
    { name: "Students", icon: <Users size={20} />, link: "/students" },
    { name: "Companies", icon: <Building2 size={20} />, link: "/companies" },
    { name: "Settings", icon: <Settings size={20} />, link: "/settings" },
  ];

  return (
    // <div
    //   onMouseEnter={() => setIsOpen(true)}
    //   onMouseLeave={() => setIsOpen(false)}
    //   className={`h-screen bg-[#0f172a] text-white fixed top-0 left-0 shadow-lg 
    //     transition-all duration-300 z-50
    //     ${isOpen ? "w-60" : "w-16"}
    //   `}
    // >
    <div
  onMouseEnter={() => setIsOpen(true)}
  onMouseLeave={() => setIsOpen(false)}
  className={`
    bg-[#0f172a] text-white h-full shadow-lg
    transition-all duration-300
    ${isOpen ? "w-60" : "w-16"}
  `}
>
      <div className="flex flex-col h-full p-3">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <span className="text-xl font-bold">📘</span>
          {isOpen && <h1 className="text-lg font-semibold">Placement</h1>}
        </div>

        {/* Menu Items */}
        <nav className="flex flex-col gap-2">
          {menus.map((item, idx) => (
            <a
              key={idx}
              href={item.link}
              className={`flex items-center gap-3 p-2 rounded-md
                hover:bg-blue-600 transition-all cursor-pointer
                ${isOpen ? "justify-start" : "justify-center"}
              `}
            >
              {item.icon}
              {isOpen && <span className="text-sm">{item.name}</span>}
            </a>
          ))}
        </nav>

        {/* Footer */}
        <div className="mt-auto pb-4">
          <p className="text-xs opacity-50 text-center">
            {isOpen ? "v1.0.0" : "v1"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
