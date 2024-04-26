import React from "react";
import { IoIosArrowBack } from "react-icons/io";
import { TbArrowBackUpDouble } from "react-icons/tb";

const Pagination = ({
  currentPage,
  handleNextPage,
  handleMaxNextPage,
  handlePrevPage,
  handleMaxPrevPage,
  handlePageChange,
  pages,
  offset,
  lastPage,
}) => {
  return (
    <div className="bg-white flex justify-center items-center bottom-0 h-12 w-full absolute">
      <div className="space-x-2 bg-pkdBlue bg-opacity-50 p-1 rounded-sm shadow-md flex items-center h-fit">
        <button
          className={`bg-green-500 flex justify-center items-center hover:bg-green-700 animated text-green-500 rounded-sm w-6 h-6 ${
            currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
          }`}
          onClick={handleMaxPrevPage}
          disabled={currentPage === 1}
        >
          <div className="bg-white w-5 h-5 rounded-full flex justify-center items-center text-lg">
            <TbArrowBackUpDouble />
          </div>
        </button>

        <button
          className={`bg-green-500 flex justify-center items-center hover:bg-green-700 animated text-green-500 rounded-sm w-6 h-6 ${
            currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
          }`}
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          <div className="bg-white w-5 h-5 rounded-full flex justify-center items-center text-lg">
            <IoIosArrowBack />
          </div>
        </button>

        <div className="w-10 text-center mina-regular bg-white rounded-sm shadow-md flex items-center justify-center pt-[.5px]">
          <select
            value={currentPage}
            className="text-center"
            onChange={(e) => handlePageChange(Number(e.target.value))}
          >
            {pages.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <button
          className={`bg-green-500 flex justify-center items-center hover:bg-green-700 animated text-green-500 rounded-sm w-6 h-6 ${
            currentPage === lastPage ? "cursor-not-allowed opacity-50" : ""
          }`}
          style={{ transform: "rotate(180deg)" }}
          disabled={currentPage === lastPage}
          onClick={handleNextPage}
        >
          <div className="bg-white w-5 h-5 rounded-full flex justify-center items-center text-lg">
            <IoIosArrowBack />
          </div>
        </button>

        <button
          style={{ transform: "scaleX(-1)" }} // Flip horizontally
          className={`bg-green-500 flex justify-center items-center hover:bg-green-700 animated text-green-500 rounded-sm w-6 h-6 ${
            currentPage === lastPage ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={currentPage === lastPage}
          onClick={handleMaxNextPage}
        >
          <div className="bg-white w-5 h-5 rounded-full flex justify-center items-center text-lg">
            <TbArrowBackUpDouble />
          </div>
        </button>
      </div>
    </div>
  );
};

export default Pagination;
