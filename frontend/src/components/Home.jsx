import React from "react";

function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-teal-500">
      <h1 className="text-4xl font-bold text-white mb-8">
        Student Management System Dashboard
      </h1>
      <div className="flex justify-center mb-8 w-full max-w-md overflow-hidden"> {/* Added overflow-hidden to this div */}
        <img
          src="../../public/image/dashboard-logo.png" // Replace with actual user image path
          className="w-full h-auto" // Make the image responsive
          alt="Dashboard Logo" // Added alt attribute for accessibility
        />
      </div>
    </div>
  );
}

export default HomePage;
