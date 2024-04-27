"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FaHome } from "react-icons/fa";
import Image from "next/image";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { pokeType, shiny_off, shiny_on } from "@/assets";
import PokemonDetailsComponent from "@/components/details/PokemonDetails";
import { pokemonBattlePlatforms } from "@/assets/lists/pokemonBattlePlatforms";
import PokemonImage from "@/components/details/PokemonImage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PokemonStats from "@/components/details/PokemonStats";
import { TbArrowBackUpDouble } from "react-icons/tb";
import { IoIosArrowBack } from "react-icons/io";
import Link from "next/link";
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
  stats: Stats[];
  defaultSprite: string;
  shinySprite: string;
  abilities: Ability[];
  abilityDesc: Ability[];
  abilityNew: Ability[];
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
    desc: string;
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

interface Stats {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
  total: number;
}

interface TypeDamage {
  weakTo: string[];
  quadWeakTo: string[]; // Define weakTo as an array of strings
  resistTo: string[];
  quadResistTo: string[];
  immuneTo: string[];
}

function Page() {
  const [pokemon, setPokemon] = useState<PokemonDetails[]>([]);
  const [abilityDesc, setAbilityDesc] = useState<PokemonDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [shinyOn, setShinyOn] = useState(false);
  const [typeInteractions, setTypeInteractions] = useState<TypeDamage>({
    weakTo: [],
    quadWeakTo: [],
    quadResistTo: [],
    resistTo: [],
    immuneTo: [],
  });

  const handleShinyOn = () => {
    setShinyOn(!shinyOn);
  };

  useEffect(() => {
    const fetchPokemonData = async () => {
      const currentUrl = window.location.href;
      const parts = currentUrl.split("/");
      const pokemonName = parts[parts.length - 1];
      const modifiedPokemonName = pokemonName.split("-")[0];
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
        const genusEntry = speciesData.genera.find(
          (entry: { language: { name: string } }) =>
            entry.language.name === "en"
        );
        const genus = genusEntry ? genusEntry.genus : null;
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

        if (data.types.length === 1) {
          const singleType = data.types[0].type.name;
          const type = await fetch(
            `https://pokeapi.co/api/v2/type/${singleType}`
          );
          if (!type.ok) {
            throw new Error("Failed to fetch Pokemon Species");
          }
          const typeDetails = await type.json();
          const typeDamage: TypeDamage = {
            weakTo: [],
            quadResistTo: [],
            quadWeakTo: [],
            resistTo: [],
            immuneTo: [],
          };
          typeDetails.damage_relations.double_damage_from.forEach(
            (type: { name: any }) => {
              typeDamage.weakTo.push(type.name);
            }
          );
          typeDetails.damage_relations.half_damage_from.forEach(
            (type: { name: any }) => {
              typeDamage.resistTo.push(type.name);
            }
          );
          typeDetails.damage_relations.no_damage_from.forEach(
            (type: { name: any }) => {
              typeDamage.immuneTo.push(type.name);
            }
          );

          setTypeInteractions(typeDamage);
        } else if (data.types.length !== 1) {
          const type1Data = data.types[0].type.name;
          const type2Data = data.types[1].type.name;

          const type1 = await fetch(
            `https://pokeapi.co/api/v2/type/${type1Data}`
          );
          if (!type1.ok) {
            throw new Error("Failed to fetch Pokemon Species");
          }

          const type2 = await fetch(
            `https://pokeapi.co/api/v2/type/${type2Data}`
          );
          if (!type2.ok) {
            throw new Error("Failed to fetch Pokemon Species");
          }

          const type1json = await type1.json();
          const type2json = await type2.json();

          const typeDamage: TypeDamage = {
            weakTo: [],
            quadResistTo: [],
            quadWeakTo: [],
            resistTo: [],
            immuneTo: [],
          };

          type1json.damage_relations.double_damage_from.forEach(
            (type: { name: any }) => {
              typeDamage.weakTo.push(type.name);
            }
          );
          type2json.damage_relations.double_damage_from.forEach(
            (type: { name: any }) => {
              typeDamage.weakTo.push(type.name);
            }
          );

          type1json.damage_relations.half_damage_from.forEach(
            (type: { name: any }) => {
              typeDamage.resistTo.push(type.name);
            }
          );
          type2json.damage_relations.half_damage_from.forEach(
            (type: { name: any }) => {
              typeDamage.resistTo.push(type.name);
            }
          );

          type1json.damage_relations.no_damage_from.forEach(
            (type: { name: any }) => {
              typeDamage.immuneTo.push(type.name);
            }
          );
          type2json.damage_relations.no_damage_from.forEach(
            (type: { name: any }) => {
              typeDamage.immuneTo.push(type.name);
            }
          );

          // Clearning immune
          typeDamage.resistTo = typeDamage.resistTo.filter(
            (type) => !typeDamage.immuneTo.includes(type)
          );
          typeDamage.weakTo = typeDamage.weakTo.filter(
            (type) => !typeDamage.immuneTo.includes(type)
          );

          const commonTypes = typeDamage.resistTo.filter((type) =>
            typeDamage.weakTo.includes(type)
          );
          typeDamage.resistTo = typeDamage.resistTo.filter(
            (type) => !commonTypes.includes(type)
          );
          typeDamage.weakTo = typeDamage.weakTo.filter(
            (type) => !commonTypes.includes(type)
          );

          const duplicateTypes: string[] = []; // Array to store duplicate types

          // Check for duplicate types in weakTo
          typeDamage.weakTo.forEach((type, index) => {
            if (
              typeDamage.weakTo.indexOf(type) !== index &&
              !duplicateTypes.includes(type)
            ) {
              duplicateTypes.push(type); // Add the duplicate type to the array
            }
          });

          typeDamage.weakTo = typeDamage.weakTo.filter(
            (type) => !duplicateTypes.includes(type)
          );
          typeDamage.quadWeakTo.push(...duplicateTypes);

          const duplicateTypes2: string[] = []; // Array to store duplicate types

          // Check for duplicate types in weakTo
          typeDamage.resistTo.forEach((type, index) => {
            if (
              typeDamage.resistTo.indexOf(type) !== index &&
              !duplicateTypes2.includes(type)
            ) {
              duplicateTypes2.push(type); // Add the duplicate type to the array
            }
          });

          typeDamage.resistTo = typeDamage.resistTo.filter(
            (type) => !duplicateTypes2.includes(type)
          );
          typeDamage.quadResistTo.push(...duplicateTypes2);

          setTypeInteractions(typeDamage);
        }

        let totalBaseStat = 0;
        for (let i = 0; i < data.stats.length; i++) {
          totalBaseStat += data.stats[i].base_stat;
        }
        const newAbility: Ability[] = [];

        data.abilities.map(
          async (ability: { ability: { name: any } }, index: any) => {
            try {
              const abilityFetch = await fetch(
                `https://pokeapi.co/api/v2/ability/${ability.ability.name}`
              );
              if (!abilityFetch.ok) {
                throw new Error("Failed to fetch Pokemon data");
              }
              const abilityData = await abilityFetch.json();

              const enEffectEntry = abilityData.flavor_text_entries.find(
                (entry: { language: { name: string } }) =>
                  entry.language.name === "en"
              );

              const correspondingAbility = data.abilities.find(
                (item: { ability: { name: any } }) =>
                  item.ability.name === ability.ability.name
              );

              if (enEffectEntry) {
                const correspondingAbility = data.abilities.find(
                  (item: { ability: { name: any } }) =>
                    item.ability.name === ability.ability.name
                );
                correspondingAbility.ability.desc = enEffectEntry.flavor_text;
                newAbility.push(correspondingAbility);
              } else {
              }
            } catch (error) {
              console.error(error);
            }
          }
        );

        setAbilityDesc(data.abilities);
        data.abilities.desc = newAbility;
        data.abilityNew = newAbility;
        data.stats.total = totalBaseStat;
        const array: PokemonDetails[] = [data];

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

  function interpolateColor(
    value: number,
    colorScale: number[][][] | [any, any, any]
  ) {
    const [redColor, yellowColor, greenColor] = colorScale;
    let r, g, b;

    if (value <= 50) {
      const ratio = value / 50;
      r = Math.round(redColor[0] + ratio * (yellowColor[0] - redColor[0]));
      g = Math.round(redColor[1] + ratio * (yellowColor[1] - redColor[1]));
      b = Math.round(redColor[2] + ratio * (yellowColor[2] - redColor[2]));
    } else {
      const ratio = (value - 50) / 50;
      r = Math.round(yellowColor[0] + ratio * (greenColor[0] - yellowColor[0]));
      g = Math.round(yellowColor[1] + ratio * (greenColor[1] - yellowColor[1]));
      b = Math.round(yellowColor[2] + ratio * (greenColor[2] - yellowColor[2]));
    }

    return `rgb(${r}, ${g}, ${b})`;
  }

  const colorScale = [
    [255, 0, 0], // Red
    [255, 255, 0], // Yellow
    [0, 250, 0], // Green
  ];

  const handlePrev = () => {
    const prevId = pokemon[0].id - 1;
    if (prevId >= 1) {
      window.location.href = `/pokemon/${prevId}`;
    }
  };
  const handleNext = () => {
    const nextId = pokemon[0].id + 1;
    if (nextId >= 1) {
      window.location.href = `/pokemon/${nextId}`;
    }
  };
  return (
    <div className=" w-full h-full">
      <div className=" px-[10px] md:px-[50px] my-[50px] gap-4 md:grid md:grid-cols-2 lg:grid-cols-3">
        <div className="md:col-span-2 lg:hidden">
          <PokemonImage pokemon={pokemon[0]} />
        </div>

        {/* Small Window */}
        <div className="w-full flex md:hidden  justify-center">
          <Tabs defaultValue="details" className="w-full max-w-[30rem]">
            <TabsList className="w-full">
              <TabsTrigger className="w-full" value="details">
                Details
              </TabsTrigger>
              <TabsTrigger className="w-full" value="stats">
                Stats
              </TabsTrigger>
            </TabsList>
            <TabsContent value="details">
              <div className="">
                <PokemonDetailsComponent pokemon={pokemon[0]} />
              </div>
            </TabsContent>
            <TabsContent value="stats">
              {" "}
              <div className="">
                <PokemonStats
                  pokemon={pokemon}
                  typeInteractions={typeInteractions}
                  pokeType={pokeType}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Pokemon Details */}
        <div className="hidden w-full md:flex">
          <PokemonDetailsComponent
            abilityDesc={abilityDesc}
            pokemon={pokemon[0]}
          />
        </div>
        {/* Pokemon Image Desktop */}
        <div className=" justify-center hidden  items-center lg:flex">
          <PokemonImage pokemon={pokemon[0]} />
        </div>

        <div className="hidden w-full md:flex">
          <PokemonStats
            pokemon={pokemon}
            typeInteractions={typeInteractions}
            pokeType={pokeType}
          />
        </div>
      </div>

      <div className="bg-white px-[10px] md:px-[50px]  flex justify-center items-center mt-auto h-12 w-full absolute">
        <div className="flex justify-start w-6">
          <Link href="/">
            <button
              className={`bg-green-700 flex justify-center items-center hover:bg-green-900 animated text-green-700 rounded-sm w-6 h-6 `}
            >
              <div className="bg-white w-5 h-5 rounded-full flex justify-center items-center text-lg">
                <FaHome />
              </div>
            </button>
          </Link>
        </div>

        <div className="w-full flex justify-center">
          <div className="space-x-2 bg-pkdBlue bg-opacity-50 p-1 rounded-sm shadow-md flex items-center h-fit">
            <button
              disabled={pokemon[0].id === 1}
              onClick={handlePrev}
              className={`bg-green-500 flex justify-center items-center hover:bg-green-700 animated text-green-500 rounded-sm w-6 h-6 ${
                pokemon[0].id === 1 ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              <div className="bg-white w-5 h-5 rounded-full flex justify-center items-center text-lg">
                <IoIosArrowBack />
              </div>
            </button>

            <div className="p-1  h-6 flex items-center text-white">
              {pokemon[0].dexNumber}
            </div>

            <button
              onClick={handleNext}
              disabled={pokemon[0].id === 1025}
              className={`bg-green-500 flex justify-center items-center hover:bg-green-700 animated text-green-500 rounded-sm w-6 h-6 ${
                pokemon[0].id === 1025 ? "cursor-not-allowed opacity-50" : ""
              }`}
              style={{ transform: "rotate(180deg)" }}
            >
              <div className="bg-white w-5 h-5 rounded-full flex justify-center items-center text-lg">
                <IoIosArrowBack />
              </div>
            </button>
          </div>
        </div>
        <div className="w-6"> </div>
      </div>
    </div>
  );
}

export default Page;
