import { Link } from "lucide-react";
import React from "react";
import { FaHome } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";

function FailedPagination() {
  return (
    <div className="flex-col w-full h-full">
      <div className="w-full flex justify-center h-screen items-center">
        <div className="flex bg-pkdBlue bg-opacity-60 p-3 rounded-md justify-center items-center text-3xl text-white mina-regular h-fit  max-w-[80%]">
          No Pokemon Found ...
        </div>
      </div>
      <div className="bg-white px-[10px] md:px-[50px] flex justify-center items-center mt-auto h-12 w-full absolute">
        <div className="flex justify-start w-6">
          <Link href="/">
            <button className="bg-green-700 flex justify-center items-center hover:bg-green-900 animated text-green-700 rounded-sm w-6 h-6">
              <div className="bg-white w-5 h-5 rounded-full flex justify-center items-center text-lg">
                <FaHome />
              </div>
            </button>
          </Link>
        </div>

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

export default FailedPagination;
