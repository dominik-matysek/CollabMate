import React from "react";
import logo from "../assets/Logo.png";
import { useNavigate } from "react-router-dom";

function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-white rounded-lg shadow dark:bg-gray-900 m-4">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div
            onClick={() => navigate("/")}
            className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse cursor-pointer"
          >
            <img src={logo} className="h-8" alt="CollaboMate Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              CollaboMate
            </span>
          </div>
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400 ">
            <li>
              <span
                className="pr-10 cursor-pointer hover:underline"
                onClick={() => navigate("/")}
              >
                O nas
              </span>
            </li>
            <li>
              <span
                className="pr-10 cursor-pointer hover:underline"
                onClick={() => navigate("/")}
              >
                Kontakt
              </span>
            </li>
            <li>
              <span
                className="pr-10 cursor-pointer hover:underline"
                onClick={() => navigate("/")}
              >
                Licencjonowanie
              </span>
            </li>
            <li>
              <span
                className="pr-10 cursor-pointer hover:underline"
                onClick={() => navigate("/")}
              >
                Polityka prywatności
              </span>
            </li>
          </ul>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © 2023{" "}
          <span
            onClick={() => navigate("https://flowbite.com/")}
            className="hover:underline cursor-pointer"
          >
            CollaboMate™
          </span>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  );
}

export default Footer;
