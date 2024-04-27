import { StaticImageData } from "next/image";

import normal from "../images/battle platforms/normal.png";
import fire from "../images/battle platforms/fire.png";
import water from "../images/battle platforms/water.png";
import electric from "../images/battle platforms/electric.png";
import grass from "../images/battle platforms/grass.png";
import ice from "../images/battle platforms/ice.png";
import fighting from "../images/battle platforms/fighting.png";
import poison from "../images/battle platforms/ghost.png";
import ground from "../images/battle platforms/ground.png";
import flying from "../images/battle platforms/flying.png";
import psychic from "../images/battle platforms/psychic.png";
import bug from "../images/battle platforms/bug.png";
import rock from "../images/battle platforms/rock.png";
import ghost from "../images/battle platforms/ghost.png";
import dark from "../images/battle platforms/dark.png";
import dragon from "../images/battle platforms/dragon.png";
import fairy from "../images/battle platforms/fairy.png";
import steel from "../images/battle platforms/steel.png";

interface PokemonBattlePlatforms {
  [key: string]: StaticImageData;
}

export const pokemonBattlePlatforms: PokemonBattlePlatforms = {
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
  dark,
  dragon,
  fairy,
  steel,
};
