// PokemonDetails.tsx
"use cilent";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { pokeType } from "@/assets";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface Props {
  pokemon: PokemonDetails2;
}

interface PokemonDetails2 {
  id: number;
  name: string;
  genus: string;
  dexEntry: string;
  dexNumber: string;
  height: number;
  weight: number;
  abilityNew: Ability[];
  types: Types[];
  abilities: Ability[];
  correspondingAbility: string[];
}
interface BaseAbility {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

interface Ability {
  ability: {
    desc?: string; // Optional description property
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;

  correspondingAbility: string[];
}

interface Types {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

interface EnhancedAbility {
  ability: {
    name: string;
    url: string;
    desc?: string;
  };
  is_hidden: boolean;
  slot: number;
}
function PokemonDetailsComponent({ pokemon }: Props) {
  function convert(value: number) {
    return (value / 10).toFixed(1);
  }

  function capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
  const [abilitiesList, setAbilitiesList] = useState<EnhancedAbility[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const updatedAbilityList = await Promise.all(
          pokemon.abilities.map(async (ability) => {
            const response = await fetch(
              `https://pokeapi.co/api/v2/ability/${ability.ability.name}`
            );
            if (!response.ok) {
              throw new Error("Failed to fetch Pokemon data");
            }
            const abilityData = await response.json();
            const enEffectEntry = abilityData.flavor_text_entries.find(
              (entry: { language: { name: string } }) =>
                entry.language.name === "en"
            );

            return {
              ...ability,
              ability: { ...ability.ability, desc: enEffectEntry.flavor_text },
            };
          })
        );
        if (Array.isArray(updatedAbilityList)) {
          setAbilitiesList(updatedAbilityList);
        } else {
          console.error(
            "updatedAbilityList is not an array:",
            updatedAbilityList
          );
          setAbilitiesList([]); // Set to empty array or handle accordingly
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [pokemon]);

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
          {pokemon &&
            abilitiesList &&
            abilitiesList.map((ability, index) => (
              <li
                key={index}
                className="animated hover:translate-y-[-2px] hover:cursor-default hover:text-gray-200"
              >
                <HoverCard>
                  <HoverCardTrigger>
                    <span className="text-xs"> {index + 1}. </span>
                    {capitalizeFirstLetter(ability.ability.name)}
                    {ability.is_hidden && (
                      <span className="text-xs"> (Hidden)</span>
                    )}
                  </HoverCardTrigger>
                  <HoverCardContent>{ability.ability.desc}</HoverCardContent>
                </HoverCard>
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
