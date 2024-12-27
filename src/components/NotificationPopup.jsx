import React, { useEffect, useState } from "react";

const NotificationPopup = ({ message, setMessage}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      setMessage(false);
    }, 2500); 
    return () => clearTimeout(timer); 
  }, [message, setMessage]);

  return (
    <>
      {message && (
        <div className="fixed top-0 left-1/2  -translate-x-1/2 mt-6 z-50 transition-all duration-700 ease-in-out transform translate-y-0 opacity-100">
          <div className="bg-white p-6 rounded-lg shadow-lg relative max-w-sm mx-auto">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-center w-full">Thông báo</h2>
              <button
                className="text-gray-500"
                onClick={() => setMessage(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <p className="mt-4 text-gray-800">{message}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default NotificationPopup;
