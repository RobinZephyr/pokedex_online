import normal from "../images/type backgrounds/normal.png";
import grass from "../images/type backgrounds/grass.png";
import fire from "../images/type backgrounds/fire.png";
import water from "../images/type backgrounds/water.png";
import electric from "../images/type backgrounds/electric.png";
import ice from "../images/type backgrounds/ice.png";
import fighting from "../images/type backgrounds/fighting.png";
import poison from "../images/type backgrounds/poison.png";
import ground from "../images/type backgrounds/ground.png";
import flying from "../images/type backgrounds/flying.png";
import psychic from "../images/type backgrounds/psychic.png";
import bug from "../images/type backgrounds/bug.png";
import rock from "../images/type backgrounds/rock.png";
import ghost from "../images/type backgrounds/ghost.png";
import dark from "../images/type backgrounds/dark.png";
import dragon from "../images/type backgrounds/dragon.png";
import fairy from "../images/type backgrounds/fairy.png";
import steel from "../images/type backgrounds/steel.png";
import { StaticImageData } from "next/image";

interface PokemonTypeBg {
  [key: string]: StaticImageData;
}

export const pokemonTypeBg: PokemonTypeBg = {
  normal,
  fire,
  water,
  electric,
  grass,
  ice,
  fighting,
  poison,
  ground,
  flying,
  psychic,
  bug,
  rock,
  ghost,
  dark, // Add 'dark' here
  dragon,
  fairy,
  steel,
};
