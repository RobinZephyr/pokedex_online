"use client";
import React from "react";
import FailedPagination from "@/components/details/FailedPagination";
import { FaHome } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import Link from "next/link";

export default function Custom404() {
  return (
    <div className="flex-col">
      <div className="h-screen flex justify-center items-center">
        <div className="w-full space-y-4 max-w-sm text-center p-4 rounded-md shadow-md bg-pkdBlue bg-opacity-50 text-white mina-regular">
          <div className="text-5xl">404</div>
          <div>Page Not Found</div>
          <div className="w-full flex justify-center">
            <Link
              href={"/"}
              className="bg-green-500 flex justify-center w-fit hover:bg-green-700 animated rounded-md shadow-md p-2"
            >
              <div className="flex items-center w-fit space-x-2">
                <div className="rounded-full bg-white text-green-500 p-1">
                  <FaHome />
                </div>
                <div className="text-center ">Return home</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
      <div className="bg-white px-[10px] md:px-[50px] flex justify-center items-center mt-auto h-12 w-full absolute">
        <div className="flex justify-start w-6"></div>

        <div className="w-full flex justify-center">
          <div className="space-x-2 bg-pkdBlue bg-opacity-50 p-1 rounded-sm shadow-md flex items-center h-fit">
            <button
              disabled={true}
              className={`bg-green-500 flex justify-center items-center hover:bg-green-700 animated text-green-500 rounded-sm w-6 h-6 ${
                true ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              <div className="bg-white w-5 h-5 rounded-full flex justify-center items-center text-lg">
                <IoIosArrowBack />
              </div>
            </button>

            <div className="p-1 h-6 flex items-center text-white">0</div>

            <button
              disabled={true}
              className={`bg-green-500 flex justify-center items-center hover:bg-green-700 animated text-green-500 rounded-sm w-6 h-6 ${
                true ? "cursor-not-allowed opacity-50" : ""
              }`}
              style={{ transform: "rotate(180deg)" }}
            >
              <div className="bg-white w-5 h-5 rounded-full flex justify-center items-center text-lg">
                <IoIosArrowBack />
              </div>
            </button>
          </div>
        </div>
        <div className="w-6"></div>
      </div>
    </div>
  );
}
