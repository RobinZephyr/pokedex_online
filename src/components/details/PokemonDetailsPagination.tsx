import React from "react";
import Link from "next/link";
import { IoIosArrowBack } from "react-icons/io";
import { FaHome } from "react-icons/fa";

interface PokemonDetailsPaginationProps {
  pokemonId: number;
  maxId: number;
}

const PokemonDetailsPagination: React.FC<PokemonDetailsPaginationProps> = ({
  pokemonId,
  maxId,
}) => {
  const handlePrev = () => {
    const prevId = pokemonId - 1;
    if (prevId >= 1) {
      window.location.href = `/pokemon/${prevId}`;
    }
  };

  const handleNext = () => {
    const nextId = pokemonId + 1;
    if (nextId <= maxId) {
      window.location.href = `/pokemon/${nextId}`;
    }
  };

  return (
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
            disabled={pokemonId === 1}
            onClick={handlePrev}
            className={`bg-green-500 flex justify-center items-center hover:bg-green-700 animated text-green-500 rounded-sm w-6 h-6 ${
              pokemonId === 1 ? "cursor-not-allowed opacity-50" : ""
            }`}
          >
            <div className="bg-white w-5 h-5 rounded-full flex justify-center items-center text-lg">
              <IoIosArrowBack />
            </div>
          </button>

          <div className="p-1 h-6 flex items-center text-white">
            {String(pokemonId).padStart(3, "0")}
          </div>

          <button
            onClick={handleNext}
            disabled={pokemonId === maxId}
            className={`bg-green-500 flex justify-center items-center hover:bg-green-700 animated text-green-500 rounded-sm w-6 h-6 ${
              pokemonId === maxId ? "cursor-not-allowed opacity-50" : ""
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
  );
};

export default PokemonDetailsPagination;
