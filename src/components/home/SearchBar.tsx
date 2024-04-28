import { wooden_background } from "@/assets";
import { PokemonTypes } from "@/assets/lists/pokemonType";
import Image from "next/image";
import { FaMagnifyingGlass } from "react-icons/fa6";
import React, { useState } from "react";

import { pokeType } from "../../assets/index.ts";
import { StaticImageData } from "next/image";

const typeIcons: { [key: string]: string | StaticImageData } = pokeType;

interface SearchBarProps {
  handleSearchButtonClick: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => Promise<void>;
  handleSearchInput: (event: React.ChangeEvent<HTMLInputElement>) => void;

  searchTermShow: string;
  selectedType: string;
  pokeType: { [key: string]: StaticImageData };
  handleTypeChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  handleSearchButtonClick,
  handleSearchInput,
  searchTermShow,
  selectedType,
  pokeType,
  handleTypeChange,
}) => {
  return (
    <div className="w-fit gap-1 bg-pkdBlue bg-opacity-60 rounded-sm p-2 flex items-center md:space-x-4 ">
      <div className="h-full flex item-center gap-1 md:space-x-2">
        <input
          onChange={handleSearchInput}
          value={searchTermShow}
          placeholder="Search "
          className=" rounded-sm tracking-widest h-8   p-1 w-full  md:w-60 mina-regular shadow-sm "
        />

        <button
          type="button"
          onClick={handleSearchButtonClick}
          className="p-2 rounded-sm bg-green-500 w-8 h-8 text-white shadow-md animated hover:bg-green-600"
        >
          <FaMagnifyingGlass />
        </button>
      </div>

      <div className=" flex md:space-x-2 gap-1  ">
        <select
          className="h-8 rounded-md mina-regular flex items-center"
          value={selectedType}
          onChange={handleTypeChange}
        >
          <option value="all">Type</option>
          {PokemonTypes.map((type, index) => (
            <option key={type.name} value={type.name}>
              {type.name}
            </option>
          ))}
        </select>
        {selectedType !== "all" ? (
          <Image
            src={typeIcons[selectedType.toLowerCase()]}
            alt="Type"
            title={selectedType}
            className="w-8 h-8 rounded-md shadow-md"
          />
        ) : (
          <div
            title="Choose a Type"
            className="hover:cursor-default pt-1 w-8 h-8 text-white mina-regular text-lg rounded-md bg-gray-500 shadow-md flex justify-center items-center"
          >
            ?
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
