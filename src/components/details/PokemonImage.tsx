import React, { useState } from "react";
import Image from "next/image";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { shiny_off, shiny_on } from "@/assets";
import { pokemonBattlePlatforms } from "@/assets/lists/pokemonBattlePlatforms";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TbPokeball } from "react-icons/tb";
import Link from "next/link";
interface PokemonImageProps {
  pokemon: PokemonDetails;
  currentPokemon: number;
}
interface PokemonDetails {
  id: number;
  name: string;
  genus: string;
  dexEntry: string;
  defaultSprite: string;
  shinySprite: string;
  dexNumber: string;
  height: number;
  species: any;
  pokemon: PokemonDetails[];
  weight: number;
  variations: Varieties[];
  types: Types[];
}
interface Types {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

interface Varieties {
  is_default: boolean;
  pokemon: {
    id?: number;
    form?: string;
    name: string;
    url: string;
  };
}
const PokemonImage: React.FC<PokemonImageProps> = ({ pokemon }) => {
  const [shinyOn, setShinyOn] = useState(false);

  const handleShinyOn = () => {
    setShinyOn(!shinyOn);
  };

  if (!pokemon) {
    return (
      <div className="flex justify-center w-full h-[30rem] item-center ">
        <div className="flex items-center text-[10rem] text-white">
          <AiOutlineLoading3Quarters className="animate-spin flex items-center" />
        </div>
      </div>
    );
  }

  function capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
  const match = pokemon.species.url.match(/pokemon-species\/(\d+)\//);
  const pokemonSpeciesId = match[1];
  return (
    <div className="flex items-center justify-center">
      <div className="w-[300px] h-[300px] absolute flex justify-end">
        <div className="absolute inset-0 flex justify-center items-center">
          <Image
            style={{ zIndex: 2 }}
            onClick={handleShinyOn}
            src={shinyOn ? shiny_on : shiny_off}
            className="ml-auto hover:cursor-pointer mb-auto"
            alt="Shiny Icon"
            title={!shinyOn ? "Shiny On" : "Shiny Off"}
            width={50}
            height={50}
          />
        </div>
        {pokemon.variations.length !== 0 && (
          <div className="absolute inset-0 flex justify-center items-center">
            <div className="mr-auto mb-auto" style={{ zIndex: 2 }}>
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="bg-pink-200 rounded-md text-pink-200 p-1 hover:bg-pink-200 hover:text-pink-200 animated shadow-sm"
                  title="Altername Forms"
                >
                  <TbPokeball className="text-3xl  bg-white rounded-full" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="max-h-[10rem] overflow-y-auto">
                  <DropdownMenuLabel>Alternate Forms</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href={`/pokemon/${pokemonSpeciesId}`}>Default</Link>
                  </DropdownMenuItem>
                  {pokemon.variations.map((variation, index) => (
                    <div className={`texl-sm`} key={index}>
                      <DropdownMenuItem>
                        <Link href={`/pokemon/${variation.pokemon.id}`}>
                          {capitalizeFirstLetter(
                            String(variation.pokemon.form)
                          )}
                        </Link>
                      </DropdownMenuItem>
                    </div>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )}
      </div>

      <img
        width={300}
        height={300}
        src={!shinyOn ? pokemon.defaultSprite : pokemon.shinySprite}
        alt={pokemon.name}
      />

      <div className="w-[300px] h-[300px] absolute flex justify-center">
        <div className="absolute inset-0 flex justify-center items-center">
          <div
            style={{ zIndex: -1 }}
            className={`bg-black absolute bg-opacity-50 w-[90%] h-[90%]  rounded-full `}
          />
          <div
            style={{ zIndex: -1 }}
            className={`bg-op-${pokemon.types[0].type.name} absolute w-[90%] h-[90%]  rounded-full `}
          />
        </div>
      </div>
    </div>
  );
};

export default PokemonImage;
