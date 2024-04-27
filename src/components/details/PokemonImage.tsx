import React, { useState } from "react";
import Image from "next/image";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { shiny_off, shiny_on } from "@/assets";
import { pokemonBattlePlatforms } from "@/assets/lists/pokemonBattlePlatforms";

interface PokemonImageProps {
  pokemon: PokemonDetails;
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
  weight: number;
  types: Types[];
}
interface Types {
  slot: number;
  type: {
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
      </div>

      <img
        width={290}
        height={290}
        className=" pb-0"
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
