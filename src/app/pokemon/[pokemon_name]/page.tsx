"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { pokeType, shiny_off, shiny_on } from "@/assets";
import PokemonDetailsComponent from "@/components/details/PokemonDetails";
import { pokemonBattlePlatforms } from "@/assets/lists/pokemonBattlePlatforms";
import PokemonImage from "@/components/details/PokemonImage";
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
  defaultSprite: string;
  shinySprite: string;
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
  const [shinyOn, setShinyOn] = useState(false);

  const handleShinyOn = () => {
    setShinyOn(!shinyOn);
  };

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
        const formattedDexEntry = dexEntry.replace(/\f/g, " ");

        const data = await response.json();
        const formattedOrder = String(data.id).padStart(3, "0");
        const defaultSprite =
          data.sprites.other["official-artwork"].front_default;
        const shinySprite = data.sprites.other["official-artwork"].front_shiny;
        data.defaultSprite = defaultSprite;
        data.shinySprite = shinySprite;
        data.dexNumber = formattedOrder;
        data.genus = genus;
        data.dexEntry = formattedDexEntry;

        const array: PokemonDetails[] = [data];

        console.log(data.types[0]);
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
    <div className="px-[10px] md:px-[50px] my-[50px] w-full h-full">
      <div className="grid grid-cols-3 gap-4">
        {/* Pokemon Details */}
        <PokemonDetailsComponent pokemon={pokemon[0]} />

        {/* Pokemon Image */}
        <PokemonImage pokemon={pokemon[0]} />
      </div>
    </div>
  );
}

export default Page;
