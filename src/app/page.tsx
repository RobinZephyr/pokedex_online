"use client";
import { wooden_background } from "@/assets";
import { PokemonTypes } from "@/assets/lists/pokemonType";
import Header from "@/components/home/Header";
import SearchBar from "@/components/home/SearchBar";
import Image from "next/image";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { useState } from "react"; // Importing useState from react
import * as typeIcons from "../assets/index.ts";

export default function Home() {
  return (
    <div>
      <Header />
      <div style={{ zIndex: 10 }} className="px-[60px] mt-[50px] w-full h-full">
        <SearchBar />
      </div>

      <div>
        
      </div>
    </div>
  );
}
