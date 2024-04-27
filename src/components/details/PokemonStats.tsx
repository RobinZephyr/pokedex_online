// PokemonStats.tsx

import React from "react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface PokemonStatsProps {
  pokemon: any[]; // Define the type of the pokemon prop
  typeInteractions: any; // Define the type of the typeInteractions prop
  pokeType: any; // Define the type of the pokeType prop
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

const PokemonStats: React.FC<PokemonStatsProps> = ({
  pokemon,
  typeInteractions,
  pokeType,
}) => {
  return (
    <div className="text-white mina-regular  w-full tracking-widest space-y-5 flex-col shadow-md bg-pkdBlue bg-opacity-60 p-4 h-full rounded-md">
      <div>
        <div className="text-3xl">Stats</div>
        <div className="pt-3 text-xl space-y-1">
          {pokemon[0].stats.map((stats: any, index: number) => (
            <div key={index} className="flex space-x-2">
              <div className="w-[30%] whitespace-nowrap tracking-wider flex items-center justify-end">
                {stats.stat.name === "special-attack"
                  ? "SP. ATK."
                  : stats.stat.name === "special-defense"
                  ? "SP. DEF."
                  : stats.stat.name.toLocaleUpperCase()}
              </div>
              <div className="w-[15%] flex justify-center items-center h-full">
                {stats.base_stat}
              </div>
              <div className="w-[50%] flex items-center">
                <div
                  className="h-1 rounded-full shadow-md"
                  style={{
                    width: `${Math.min(stats.base_stat, 100)}%`,
                    background: interpolateColor(stats.base_stat, colorScale),
                  }}
                />
              </div>
            </div>
          ))}
          <div className="flex space-x-2 text-2xl pt-2">
            <div className="w-[30%] text-end">Total</div>
            <div className="w-[15%] text-center">
              {pokemon[0].stats.reduce(
                (total: number, stat: any) => total + stat.base_stat,
                0
              )}
            </div>
            <div className="w-[50%]"></div>
          </div>

          <div className="w-full pt-5 min-h-[10rem]">
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
                  <div className="flex-wrap flex justify-center gap-4 w-full">
                    {typeInteractions.weakTo.map(
                      (weak: string, index: number) => (
                        <div
                          key={index}
                          className={`bg-${weak} flex items-center px-[3px] py-[2px] rounded-full text-[1rem] min-w-[100px]`}
                        >
                          <Image
                            src={pokeType[weak]}
                            alt={weak}
                            className="w-5 h-5 rounded-full object-cover"
                          />
                          <div className="flex tracking-tight text-sm item-center w-full justify-center pt-1">
                            {weak.toUpperCase()}
                          </div>
                          <div className="justify-end w-5 h-5 rounded-full bg-white tracking-tighter p-[2px] text-xs text-black border-[1px] flex item-center">
                            x2
                          </div>
                        </div>
                      )
                    )}
                    {typeInteractions.quadWeakTo.map(
                      (weak: string, index: number) => (
                        <div
                          key={index}
                          className={`bg-${weak} flex items-center px-[3px] py-[2px] rounded-full text-[1rem] min-w-[100px]`}
                        >
                          <Image
                            src={pokeType[weak]}
                            alt={weak}
                            className="w-5 h-5 rounded-full object-cover"
                          />
                          <div className="flex tracking-tight text-sm item-center w-full justify-center pt-1">
                            {weak.toUpperCase()}
                          </div>
                          <div className="justify-end w-5 h-5 rounded-full bg-white tracking-tighter p-[2px] text-xs text-black border-[1px] flex item-center">
                            x4
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="resistTo">
                <div className="pt-4">
                  <div className="flex-wrap flex justify-center gap-4 w-full">
                    {typeInteractions.resistTo.map(
                      (resist: string, index: number) => (
                        <div
                          key={index}
                          className={`bg-${resist} flex items-center px-[3px] py-[2px] rounded-full text-[1rem] min-w-[100px]`}
                        >
                          <Image
                            src={pokeType[resist]}
                            alt={resist}
                            className="w-5 h-5 rounded-full object-cover"
                          />
                          <div className="flex tracking-tight text-sm item-center w-full justify-center pt-1">
                            {resist.toUpperCase()}
                          </div>
                          <div className="justify-end w-5 h-5 text-[8px] rounded-full bg-white tracking-tighter p-[2px] text-xs text-black border-[1px] flex item-center">
                            x0.5
                          </div>
                        </div>
                      )
                    )}

                    {typeInteractions.quadResistTo.map(
                      (resist: string, index: number) => (
                        <div
                          key={index}
                          className={`bg-${resist} flex items-center px-[3px] py-[2px] rounded-full text-[1rem] min-w-[100px]`}
                        >
                          <Image
                            src={pokeType[resist]}
                            alt={resist}
                            className="w-5 h-5 rounded-full object-cover"
                          />
                          <div className="flex tracking-tight text-sm item-center w-full justify-center pt-1">
                            {resist.toUpperCase()}
                          </div>
                          <div className=" text-[7px] justify-end w-5 h-5 rounded-full bg-white tracking-tighter p-[2px] text-xs text-black border-[1px] flex item-center">
                            x0.25
                          </div>
                        </div>
                      )
                    )}
                    {typeInteractions.immuneTo.map(
                      (immune: string, index: number) => (
                        <div
                          key={index}
                          className={`bg-${immune} flex items-center px-[3px] py-[2px] rounded-full text-[1rem] min-w-[100px]`}
                        >
                          <Image
                            src={pokeType[immune]}
                            alt={immune}
                            className="w-5 h-5 rounded-full object-cover"
                          />
                          <div className="flex tracking-tight text-sm item-center w-full justify-center pt-1">
                            {immune.toUpperCase()}
                          </div>
                          <div className="justify-end w-5 h-5 rounded-full bg-white tracking-tighter p-[2px] text-xs text-black border-[1px] flex item-center">
                            x0
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonStats;
