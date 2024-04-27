// PokemonDetails.tsx

import React from "react";
import Image from "next/image";
import { pokeType } from "@/assets";

interface Props {
  pokemon: PokemonDetails;
}

interface PokemonDetails {
  id: number;
  name: string;
  genus: string;
  dexEntry: string;
  dexNumber: string;
  height: number;
  weight: number;
  abilities: Ability[];
  types: Types[];
}

interface Ability {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

interface Types {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

function PokemonDetailsComponent({ pokemon }: Props) {
  function convert(value: number) {
    return (value / 10).toFixed(1);
  }

  function capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  return (
    <div className="text-white mina-regular tracking-widest space-y-5  flex-col shadow-md bg-pkdBlue bg-opacity-60 p-4 h-full rounded-md ">
      <div className=" flex-col">
        <div className="text-lg">No. {pokemon.dexNumber}</div>
        <div className="text-4xl pt-1">{pokemon.name.toUpperCase()}</div>
        <div className="text-md ">{pokemon.genus}</div>
      </div>

      <div className="flex space-x-4">
        {pokemon.types.map((types, index) => (
          <div
            className={`flex items-center justify-center rounded-full shadow-md w-[120px] py-[1px] bg-${types.type.name}`}
            key={index}
          >
            <span className="w-[30%] pl-2">
              <Image
                src={pokeType[types.type.name]}
                alt={types.type.name}
                className="w-full h-5 object-cover"
              />
            </span>
            <span className="pl-1 tracking-wider w-[70%]">
              {types.type.name.toLocaleUpperCase()}
            </span>
          </div>
        ))}
      </div>

      <div className="space-y-1">
        <div className="text-xl font-semibold">Ability</div>
        <ol className="text-md pl-5">
          {pokemon.abilities.map((ability, index) => (
            <li key={index}>
              <span className="text-xs"> {index + 1}. </span>
              {capitalizeFirstLetter(ability.ability.name)}
              {ability.is_hidden && <span className="text-xs"> (Hidden)</span>}
            </li>
          ))}
        </ol>
      </div>

      <div className="min-h-[10rem]">
        <div className="text-xl font-semibold">Pokedex Entry</div>
        <div
          className=" text-justify tracking-wider pt-2"
          style={{ textIndent: "20px" }}
        >
          {pokemon.dexEntry}
        </div>
      </div>

      <div className="grid grid-cols-2">
        <div className=" justify-center">
          <div className="flex text-md items-center font-semibold">Height</div>
          <div className="text-2xl text-center tracking-normal ">
            {convert(pokemon.height)} m
          </div>
        </div>

        <div className="">
          <div className=" flex items-center text-md  font-semibold">
            Weight
          </div>
          <div className="text-2xl  items-center  text-center  whitespace-nowrap tracking-normal">
            {convert(pokemon.weight)} kg
          </div>
        </div>
      </div>
    </div>
  );
}

export default PokemonDetailsComponent;
