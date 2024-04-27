"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { pokeType, shiny_off, shiny_on } from "@/assets";
import PokemonDetailsComponent from "@/components/details/PokemonDetails";
import { pokemonBattlePlatforms } from "@/assets/lists/pokemonBattlePlatforms";
import PokemonImage from "@/components/details/PokemonImage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
          console.log("Types weak to", typeDamage);
          setTypeInteractions(typeDamage);
        } else if (data.types.length !== 1) {
          console.log("DUAL TYPE DUAL TYPE");
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
          console.log(typeDamage);
          setTypeInteractions(typeDamage);
        }

        let totalBaseStat = 0;
        for (let i = 0; i < data.stats.length; i++) {
          totalBaseStat += data.stats[i].base_stat;
        }

        data.abilities.map(async (ability, index) => {
          try {
            const abilityFetch = await fetch(
              `https://pokeapi.co/api/v2/ability/${ability.ability.name}`
            );
            if (!abilityFetch.ok) {
              throw new Error("Failed to fetch Pokemon data");
            }
            const abilityData = await abilityFetch.json();

            const correspondingAbility = data.abilities.find(
              (item) => item.ability.name === ability.ability.name
            );

            // Check if the corresponding ability object is found and if abilityData.effect_entries is not empty
            if (
              correspondingAbility &&
              abilityData.effect_entries &&
              abilityData.effect_entries.length > 1
            ) {
              correspondingAbility.ability.desc =
                abilityData.effect_entries[1].short_effect;
            }
          } catch (error) {
            console.error(error);
          }
        });

        data.stats.total = totalBaseStat;

        const array: PokemonDetails[] = [data];
        console.log(data);

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

  return (
    <div className="px-[10px] md:px-[50px] my-[50px] w-full h-full">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="block lg:hidden md:col-span-2  h-full">
          <PokemonImage pokemon={pokemon[0]} />
        </div>

        {/* Pokemon Details */}
        <PokemonDetailsComponent pokemon={pokemon[0]} />

        {/* Pokemon Image */}
        <div className="lg:flex justify-center hidden h-full  items-center">
          <PokemonImage pokemon={pokemon[0]} />
        </div>

        <div className="text-white mina-regular tracking-widest space-y-5  flex-col shadow-md bg-pkdBlue bg-opacity-60 p-4 h-full rounded-md ">
          <div>
            <div className="text-3xl">Stats</div>
            <div className="pt-3 text-xl space-y-1">
              {pokemon[0].stats.map((stats, index) => (
                <div key={index} className="flex space-x-2 ">
                  <div className=" w-[30%] whitespace-nowrap tracking-wider flex  items-center justify-end">
                    {stats.stat.name === "special-attack"
                      ? "SP. ATK."
                      : stats.stat.name === "special-defense"
                      ? "SP. DEF."
                      : stats.stat.name.toLocaleUpperCase()}
                  </div>
                  <div className="w-[15%] flex justify-center  items-center h-full">
                    {" "}
                    {stats.base_stat}
                  </div>
                  <div className="w-[50%] flex  items-center">
                    <div
                      className="h-1 rounded-full shadow-md"
                      style={{
                        width: `${Math.min(stats.base_stat, 100)}%`,
                        background: interpolateColor(
                          stats.base_stat,
                          colorScale
                        ),
                      }}
                    />
                  </div>
                </div>
              ))}
              <div className="flex space-x-2  text-2xl pt-2">
                <div className="w-[30%] text-end">Total</div>
                <div className="w-[15%] text-center">
                  {pokemon[0].stats.reduce(
                    (total, stat) => total + stat.base_stat,
                    0
                  )}
                </div>
                <div className="w-[50%]"></div>
              </div>

              <div className="w-full pt-5">
                <Tabs defaultValue="weakTo" className="w-full">
                  <TabsList className="w-full grid-cols-2 grid bg-none">
                    <TabsTrigger value="weakTo" className="text-lg p-0">
                      Weakness
                    </TabsTrigger>
                    <TabsTrigger value="resistTo" className="text-lg p-0">
                      Resistances
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="weakTo" className="pt-4">
                    <div className="">
                      <div className="flex-wrap flex justify-center   gap-4 w-full">
                        {typeInteractions.weakTo.map((weak, index) => (
                          <div
                            key={index}
                            className={`bg-${weak} flex items-center px-[3px] py-[2px] rounded-full text-[1rem] min-w-[100px] `}
                          >
                            <Image
                              src={pokeType[weak]}
                              alt={weak}
                              className="w-5 h-5  rounded-full object-cover"
                            />
                            <div className="flex tracking-tight   text-sm item-center w-full justify-center pt-1">
                              {weak.toUpperCase()}
                            </div>
                            <div className="justify-end w-5 h-5  rounded-full bg-white tracking-tighter p-[2px] text-xs text-black border-[1px]  flex item-center ">
                              2x
                            </div>
                          </div>
                        ))}
                        {typeInteractions.quadWeakTo.map((weak, index) => (
                          <div
                            key={index}
                            className={`bg-${weak} flex items-center px-[3px] py-[2px] rounded-full text-[1rem] min-w-[100px] `}
                          >
                            <Image
                              src={pokeType[weak]}
                              alt={weak}
                              className="w-5 h-5  rounded-full object-cover"
                            />
                            <div className="flex tracking-tight   text-sm item-center w-full justify-center pt-1">
                              {weak.toUpperCase()}
                            </div>
                            <div className="justify-end w-5 h-5  rounded-full bg-white tracking-tighter p-[2px] text-xs text-black border-[1px]  flex item-center ">
                              4x
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="resistTo">
                    <div className="pt-4">
                      <div className="flex-wrap flex justify-center   gap-4 w-full">
                        {typeInteractions.resistTo.map((resist, index) => (
                          <div
                            key={index}
                            className={`bg-${resist} flex items-center px-[3px] py-[2px] rounded-full text-[1rem] min-w-[100px] `}
                          >
                            <Image
                              src={pokeType[resist]}
                              alt={resist}
                              className="w-5 h-5  rounded-full object-cover"
                            />
                            <div className="flex tracking-tight   text-sm item-center w-full justify-center pt-1">
                              {resist.toUpperCase()}
                            </div>
                            <div className="justify-end w-5 h-5  rounded-full bg-white tracking-tighter p-[2px] text-xs text-black border-[1px]  flex item-center ">
                              2x
                            </div>
                          </div>
                        ))}
                        {typeInteractions.quadResistTo.map((resist, index) => (
                          <div
                            key={index}
                            className={`bg-${resist} flex items-center px-[3px] py-[2px] rounded-full text-[1rem] min-w-[100px] `}
                          >
                            <Image
                              src={pokeType[resist]}
                              alt={resist}
                              className="w-5 h-5  rounded-full object-cover"
                            />
                            <div className="flex tracking-tight   text-sm item-center w-full justify-center pt-1">
                              {resist.toUpperCase()}
                            </div>
                            <div className="justify-end w-5 h-5  rounded-full bg-white tracking-tighter p-[2px] text-xs text-black border-[1px]  flex item-center ">
                              4x
                            </div>
                          </div>
                        ))}
                        {typeInteractions.immuneTo.map((immune, index) => (
                          <div
                            key={index}
                            className={`bg-${immune} flex items-center px-[3px] py-[2px] rounded-full text-[1rem] min-w-[100px] `}
                          >
                            <Image
                              src={pokeType[immune]}
                              alt={immune}
                              className="w-5 h-5  rounded-full object-cover"
                            />
                            <div className="flex tracking-tight   text-sm item-center w-full justify-center pt-1">
                              {immune.toUpperCase()}
                            </div>
                            <div className="justify-end w-5 h-5  rounded-full bg-white tracking-tighter p-[2px] text-xs text-black border-[1px]  flex item-center ">
                              0x
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
