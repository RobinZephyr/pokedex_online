import React from "react";
import Image from "next/image";
import { pokemonTypeBg } from "../../assets/lists/pokemonTypeBg";
import { pokeType } from "../../assets/index.ts";
function PokemonCard({ pokemon }) {
  const typeImageUrl = pokemonTypeBg[pokemon.types[0].type.name.toLowerCase()];

  function capitalLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <div className="flex-col h-full items-center pt-10">
      <div className="w-full flex justify-center px-4">
        <div
          className="max-w-52 min-w-36 relative hover:cursor-pointer hover:translate-y-[-6px] animated"
          style={{
            boxShadow: "30px 0px 4px 0px rgba(0, 0, 0, 0.5)", // Shadow on the right
          }}
        >
          {/* Name */}
          <div className="absolute  flex w-full h-fit z-10 py-1 px-1 space-x-1  bg-white items-center mina-regular justify-between">
            <div className="w-20 text-xs text-center">#{pokemon.dexNumber}</div>
            <div className="w-full flex items-center pt-[.5px] whitespace-nowrap font-bold justify-center">
              <div> {capitalLetter(pokemon.name)}</div>
            </div>
            <div className="w-20 space-x-1  text-xs text-center flex">
              {pokemon.types.map((type, index) => (
                <div
                  key={index}
                  className="flex items-center"
                  title={capitalLetter(type.type.name)}
                >
                  <Image
                    src={pokeType[type.type.name]}
                    alt={type.type.name}
                    className="w-5 h-5  mr-1 object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {pokemon.types.length > 0 && (
            <div className="absolute inset-0 z-0 ">
              <Image
                src={typeImageUrl} // Use typeImageUrl as the src
                alt={pokemon.types[0].type.name}
                layout="fill"
                objectFit="cover"
              />
            </div>
          )}

          <div className="w-full h-full flex justify-center pt-5">
            <div className="absolute inset-0  pt-5 z-1 flex justify-center items-center">
              <div className="bg-white rounded-full w-80% h-80% bg-opacity-50" />
            </div>

            {/* Sprite */}
            <img
              src={pokemon.spriteDisplay}
              alt={pokemon.name}
              className="w-90% h-full p-3  z-10 relative"
            />
          </div>
        </div>
      </div>
      <div
        className="bg-white shadow-lg w-full h-4"
        style={{ boxShadow: "0px 10px 10px -4px rgba(0, 0, 0, 0.5)" }}
      />
    </div>
  );
}

export default PokemonCard;
