"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { pokeType } from "@/assets";
interface PokemonDetails {
  results: PokemonDetails[];
  id: number;
  name: string;
  url: string;
  genus: string;
  dexEntry: string;
  dexNumber: string;
  height: number;
  weight: number;
  abilities: Ability[];
  types: Types[];
  spriteDisplay: string;
  sprites: {
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
  };
  // Include other properties as needed
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

function Page() {
  const [pokemon, setPokemon] = useState<PokemonDetails[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPokemonData = async () => {
      const currentUrl = window.location.href;
      const parts = currentUrl.split("/");
      const pokemonName = parts[parts.length - 1];
      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch Pokemon data");
        }

        const species = await fetch(
          `https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`
        );
        if (!species.ok) {
          throw new Error("Failed to fetch Pokemon Species");
        }
        const speciesData = await species.json();
        const genus = speciesData.genera[7].genus;

        const flavorTextEntries = speciesData.flavor_text_entries;
        const englishFlavorText = flavorTextEntries.find(
          (entry: { language: { name: string } }) =>
            entry.language.name === "en"
        );

        const dexEntry = englishFlavorText.flavor_text;
        const formattedDexEntry = dexEntry.replace(/\f/g, "");

        const data = await response.json();
        const formattedOrder = String(data.id).padStart(3, "0");
        data.dexNumber = formattedOrder;
        data.genus = genus;
        data.dexEntry = formattedDexEntry;
        const array: PokemonDetails[] = [data];
        console.log(array);
        setPokemon(array);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPokemonData();
  }, []);
  if (!pokemon || pokemon.length === 0) {
    return (
      <div className="flex justify-center w-full h-[30rem] item-center ">
        <div className="flex items-center text-[10rem] text-white">
          <AiOutlineLoading3Quarters className="animate-spin flex items-center" />
        </div>
      </div>
    );
  }

  function convert(value: number) {
    return (value / 10).toFixed(1);
  }
  function capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
  return (
    <div className="px-[10px] md:px-[50px] mt-[50px] w-full h-full">
      <div className="grid grid-cols-3">
        <div className="text-white tracking-widest space-y-5  flex-col shadow-md bg-pkdBlue bg-opacity-60 p-4 h-full rounded-md ">
          <div className=" flex-col">
            <div className="text-lg">No. {pokemon[0].dexNumber}</div>
            <div className="text-4xl pt-1">{pokemon[0].name.toUpperCase()}</div>
            <div className="text-md ">{pokemon[0].genus}</div>
          </div>
          {/* Types */}

          <div className="flex space-x-4">
            {pokemon[0].types.map((types, index) => (
              <div
                className={`flex items-center justify-center rounded-full shadow-md w-[120px] py-[1px] bg-${types.type.name}`}
                key={index}
              >
                <span className="w-[30%] pl-2">
                  {" "}
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
          {/* Ability */}
          <div className="space-y-1">
            <div className="text-xl font-semibold">Ability</div>
            <ol className="text-md pl-5">
              {pokemon[0].abilities.map((ability, index) => (
                <li key={index}>
                  <span className="text-xs"> {index + 1}. </span>
                  {capitalizeFirstLetter(ability.ability.name)}
                  {ability.is_hidden && (
                    <span className="text-xs"> (Hidden)</span>
                  )}
                </li>
              ))}
            </ol>
          </div>

          {/* Pokedex Entry */}
          <div className="min-h-[10rem]">
            <div className="text-xl font-semibold">Pokedex Entry</div>
            <div
              className=" text-justify tracking-wider pt-2"
              style={{ textIndent: "20px" }}
            >
              {pokemon[0].dexEntry}
            </div>
          </div>

          {/* Weight & Height */}
          <div className="grid grid-cols-2">
            <div className="grid grid-cols-2">
              <div className="flex items-center font-semibold">Height</div>
              <div className="text-2xl">{convert(pokemon[0].height)} m</div>
            </div>

            <div className="grid grid-cols-2">
              <div className=" flex items-center font-semibold">Weight</div>
              <div className="text-2xl">{convert(pokemon[0].weight)} kg</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
