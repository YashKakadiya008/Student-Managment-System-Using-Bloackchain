import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";

function Dashboard({ role, links, handleLogout }) {
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-100 overflow-hidden">
            <div className="relative bg-white shadow-md p-4 flex justify-between items-center">
                <div
                    className="relative"
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => setDropdownOpen(false)}
                >
                    <h1 className="text-xl font-bold cursor-pointer capitalize">{role}</h1>

                    {isDropdownOpen && (
                        <div className="absolute right-0 left-1 mt-0 bg-white shadow-lg border rounded-lg z-10 min-w-[250px]">
                            <nav className="flex flex-col">
                                {links.map((link, index) => (
                                    <Link
                                        key={index}
                                        to={link.to}
                                        className="block py-2 px-4 text-gray-700 hover:bg-gray-200">
                                        {link.label}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    )}
                </div>

                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-all duration-300"
                >
                    Logout
                </button>
            </div>

            <div className="p-6 overflow-auto h-[calc(100vh-64px)]">
                <Outlet />
            </div>
        </div>
    );
}

export default Dashboard;
