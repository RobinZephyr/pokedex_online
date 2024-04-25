import wooden_background from "../assets/images/wooden_background.png";
import normal from "../assets/images/type icons/normal.jpg";
import fire from "../assets/images/type icons/fire.png";
import water from "../assets/images/type icons/water.png";
import electric from "../assets/images/type icons/electric.png";
import grass from "../assets/images/type icons/grass.png";
import ice from "../assets/images/type icons/ice.png";
import fighting from "../assets/images/type icons/fighting.png";
import poison from "../assets/images/type icons/poison.png";
import ground from "../assets/images/type icons/ground.png";
import flying from "../assets/images/type icons/flying.png";
import psychic from "../assets/images/type icons/psychic.png";
import bug from "../assets/images/type icons/bug.png";
import rock from "../assets/images/type icons/rock.png";
import ghost from "../assets/images/type icons/ghost.png";
import dark from "../assets/images/type icons/dark.png";
import dragon from "../assets/images/type icons/dragon.png";
import steel from "../assets/images/type icons/steel.png";
import fairy from "../assets/images/type icons/fairy.png";
import { StaticImageData } from "next/image";

interface pokeTypeKeys {
  [key: string]: StaticImageData;
}
const pokeType: pokeTypeKeys = {
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

export { wooden_background, pokeType };
