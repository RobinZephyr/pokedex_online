"use client";
import React, { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { pokeType } from "@/assets";
import PokemonDetailsComponent from "@/components/details/PokemonDetails";
import PokemonImage from "@/components/details/PokemonImage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PokemonStats from "@/components/details/PokemonStats";
import PokemonDetailsPagination from "@/components/details/PokemonDetailsPagination";
import FailedPagination from "@/components/details/FailedPagination";

interface PokemonDetails {
  results: PokemonDetails[];
  id: number;
  name: string;
  url: string;
  species: Species;
  abilities: Ability[];
  genus: string;
  dexEntry: string;
  dexNumber: string;
  height: number;
  pokemon: PokemonDetails[];
  correspondingAbility: string[];
  weight: number;
  stats: Stats[];
  defaultSprite: string;
  shinySprite: string;
  abilityDesc: Ability[];
  abilityNew: Ability[];
  variations: Varieties[];
  types: Types[];
  spriteDisplay: string;
  sprites: {
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
  };
}
interface Species {
  id: number;
  name: string;
  url: string;
}
interface Ability {
  ability: {
    name: string;
    url: string;
    desc: string;
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

interface Stats {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
  total: number;
}

interface Varieties {
  is_default: boolean;
  pokemon: {
    id?: number;
    speciesId?: number;
    form?: string;
    name: string;
    url: string;
  };
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
  const [failedFetch, setFailedFetch] = useState(false);
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

  const [maxId, setMaxId] = useState();
  const [currentPokemon, setCurrentPokemon] = useState();
  useEffect(() => {
    setFailedFetch(false);
    setLoading(true);
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
          setLoading(false);
          setFailedFetch(true);
          console.log("FAILED FETCH ");
          throw new Error("Failed to fetch Pokemon Species");
          return;
        }
        const data = await response.json();
        let pokemonSpecies = 0;
        const idLength = data.id.toString().length;
        if (idLength === 5) {
          const match = data.species.url.match(/pokemon-species\/(\d+)\//);
          pokemonSpecies = match[1];
          setCurrentPokemon(pokemonSpecies);
        } else {
          pokemonSpecies = Number(parts[parts.length - 1]);
          setCurrentPokemon(pokemonSpecies);
        }

        const species = await fetch(
          `https://pokeapi.co/api/v2/pokemon-species/${pokemonSpecies}`
        );

        if (!species.ok) {
          throw new Error("Failed to fetch Pokemon Species");
        }

        const speciesData = await species.json();
        let nonDefaultVarieties: Varieties[] = [];
        speciesData.varieties.forEach((variety: Varieties) => {
          const match = variety.pokemon.url.match(/pokemon\/(\d+)\//);
          if (match) {
            variety.pokemon.id = Number(match[1]);
          }

          const style = variety.pokemon.name.match(/-(.*)/);
          const namePartAfterDash = style ? style[1] : null;
          if (namePartAfterDash) {
            variety.pokemon.form = String(namePartAfterDash);
          }

          if (!variety.is_default) {
            nonDefaultVarieties.push(variety);
          }
        });

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

        const formattedOrder = String(data.id).padStart(3, "0");
        const defaultSprite =
          data.sprites.other["official-artwork"].front_default;
        const shinySprite = data.sprites.other["official-artwork"].front_shiny;
        data.defaultSprite = defaultSprite;
        data.shinySprite = shinySprite;
        data.dexNumber = formattedOrder;
        data.genus = genus;
        data.dexEntry = formattedDexEntry;
        data.variations = nonDefaultVarieties;
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

          const duplicateTypes: string[] = [];

          typeDamage.weakTo.forEach((type, index) => {
            if (
              typeDamage.weakTo.indexOf(type) !== index &&
              !duplicateTypes.includes(type)
            ) {
              duplicateTypes.push(type);
            }
          });

          typeDamage.weakTo = typeDamage.weakTo.filter(
            (type) => !duplicateTypes.includes(type)
          );
          typeDamage.quadWeakTo.push(...duplicateTypes);

          const duplicateTypes2: string[] = [];

          typeDamage.resistTo.forEach((type, index) => {
            if (
              typeDamage.resistTo.indexOf(type) !== index &&
              !duplicateTypes2.includes(type)
            ) {
              duplicateTypes2.push(type);
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
        console.log(data);

        const array: PokemonDetails[] = [data];

        setPokemon(array);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPokemonData();
  }, []);

  return (
    <div>
      {!pokemon || pokemon.length === 0 ? (
        <div className="flex justify-center w-full h-[30rem] item-center ">
          {failedFetch ? (
            <FailedPagination />
          ) : (
            <div className="flex items-center text-[10rem] text-white">
              <AiOutlineLoading3Quarters className="animate-spin flex items-center" />
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-full flex justify-center">
          {!failedFetch && pokemon.length !== 0 ? (
            <div className=" w-full h-full">
              <div className=" px-[10px] md:px-[50px] my-[50px] gap-4 md:grid md:grid-cols-2 lg:grid-cols-3">
                <div className="md:col-span-2 lg:hidden">
                  <PokemonImage
                    pokemon={pokemon[0]}
                    currentPokemon={currentPokemon}
                  />
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
                  <PokemonDetailsComponent pokemon={pokemon[0]} />
                </div>
                {/* Pokemon Image Desktop */}
                <div className=" justify-center hidden  items-center lg:flex">
                  <PokemonImage
                    pokemon={pokemon[0]}
                    currentPokemon={currentPokemon}
                  />
                </div>

                <div className="hidden w-full md:flex">
                  <PokemonStats
                    pokemon={pokemon}
                    typeInteractions={typeInteractions}
                    pokeType={pokeType}
                  />
                </div>
              </div>

              <PokemonDetailsPagination
                pokemonId={currentPokemon}
                maxId={maxId}
              />
            </div>
          ) : (
            <FailedPagination />
          )}
        </div>
      )}
    </div>
  );
}

export default Page;
