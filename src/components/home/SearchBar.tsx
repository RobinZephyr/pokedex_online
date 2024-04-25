import { wooden_background } from "@/assets";
import { PokemonTypes } from "@/assets/lists/pokemonType";
import Image from "next/image";
import { FaMagnifyingGlass } from "react-icons/fa6";
import React, { useState } from "react";

import { pokeType } from "../../assets/index.ts";
import { StaticImageData } from "next/image";

const typeIcons: { [key: string]: string | StaticImageData } = pokeType;
function SearchBar() {
  const [selectedType, setSelectedType] = useState("Type");
  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(event.target.value);
  };
  return (
    <div className="w-fit bg-pkdBlue bg-opacity-60 rounded-sm p-2 flex items-center space-x-4 ">
      <div className="h-full flex item-center space-x-2">
        <input
          placeholder="Search "
          className=" rounded-sm tracking-widest h-8   p-1 w-60 mina-regular shadow-sm "
        />

        <button className="p-2 rounded-sm bg-green-500 w-8 h-8 text-white shadow-md animated hover:bg-green-600">
          <FaMagnifyingGlass />
        </button>
      </div>

      <div className=" flex space-x-2 ">
        <select
          className="h-8 rounded-md mina-regular flex items-center"
          value={selectedType}
          onChange={handleTypeChange}
        >
          <option>Type</option>
          {PokemonTypes.map((type, index) => (
            <option key={index} value={type.name}>
              {type.name}
            </option>
          ))}
        </select>
        {selectedType !== "Type" && (
          <Image
            src={typeIcons[selectedType.toLowerCase()]}
            alt="Type"
            className="w-8 h-8 rounded-md shadow-md"
          />
        )}
      </div>
    </div>
  );
}

export default SearchBar;
