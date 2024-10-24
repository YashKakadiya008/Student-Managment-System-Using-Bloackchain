import React from "react";

function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-teal-500">
      <h1 className="text-4xl font-bold text-white mb-8">
        Student Management System Dashboard
      </h1>
      <div className="flex justify-center mb-8 w-full max-w-md overflow-hidden">
        <img
          src="../../public/image/dashboard-logo.png"
          className="w-full h-auto"
          alt="Dashboard Logo"
        />
      </div>
    </div>
  );
}

export default HomePage;
