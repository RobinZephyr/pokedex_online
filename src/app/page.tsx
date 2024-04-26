"use client";
import Header from "@/components/home/Header";
import Pagination from "@/components/home/Pagination";
import PokemonCard from "@/components/home/PokemoCard";
import SearchBar from "@/components/home/SearchBar";
import { IoIosArrowBack } from "react-icons/io";
import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { TbArrowBackUpDouble } from "react-icons/tb";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { pokeType } from "../assets/index.ts";
import { StaticImageData } from "next/image";
import { wooden_background } from "@/assets";
import { PokemonTypes } from "@/assets/lists/pokemonType";
const typeIcons: { [key: string]: string | StaticImageData } = pokeType;
export default function Home() {
  const [listPokemon, setListPokemon] = useState([]);

  const [currentPage, setCurrentPage] = useState("1");
  const [pages, setPages] = useState([]);
  const [fetchData, setFetchData] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState();

  const initialFetch = async () => {
    setLoading(true);
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=10&offset=${offset}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch Pokemon data");
    }
    const data = await response.json();

    const fetchedPokemon = [];

    for (const pokemon of data.results) {
      try {
        const pokemonResponse = await fetch(pokemon.url);
        if (!pokemonResponse.ok) {
          throw new Error("Failed to fetch Pokemon details");
        }
        const pokemonData = await pokemonResponse.json();
        const formattedOrder = String(pokemonData.id).padStart(3, "0");

        data.dexNumber = formattedOrder;
        pokemonData.dexNumber = formattedOrder;
        if (pokemonData.dexNumber.length === 5) {
          fetchedPokemon.push(pokemonData);
        }
      } catch (error) {
        setLoading(false);
      }
    }
    console.log("initialfetch", data);
    setFetchData(data);
  };

  useEffect(() => {
    initialFetch();
  }, [currentPage]);

  const handleNextPage = async () => {
    setLoading(true);
    const nextPageUrl = fetchData.next;
    if (nextPageUrl) {
      try {
        const response = await fetch(nextPageUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch next page data");
        }
        const data = await response.json();
        setFetchData(data);
        setCurrentPage(String(parseInt(currentPage) + 1));
        setOffset(offset + 10); // Increment offset by 10 for next page
      } catch (error) {
        console.error("Error fetching next page data:", error);
      } finally {
      }
    }
  };

  const handleMaxNextPage = async () => {
    setLoading(true);
    const nextPageUrl = fetchData.next;
    if (nextPageUrl) {
      try {
        const response = await fetch(nextPageUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch next page data");
        }
        const data = await response.json();
        setFetchData(data);
        setCurrentPage(String("103"));
        setOffset(1020); // Increment offset by 10 for next page
      } catch (error) {
        console.error("Error fetching next page data:", error);
      } finally {
      }
    }
  };

  const handleMaxPrevPage = async () => {
    setLoading(true);
    const prevPageUrl = fetchData.previous;
    if (prevPageUrl) {
      try {
        const response = await fetch(prevPageUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch previous page data");
        }
        const data = await response.json();
        setFetchData(data);
        setCurrentPage(String(parseInt("1")));
        setOffset(0); // Decrement offset by 10 for previous page
      } catch (error) {
        console.error("Error fetching previous page data:", error);
      } finally {
      }
    }
  };

  const handlePrevPage = async () => {
    setLoading(true);
    const prevPageUrl = fetchData.previous;
    if (prevPageUrl) {
      try {
        const response = await fetch(prevPageUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch previous page data");
        }
        const data = await response.json();
        setFetchData(data);
        setCurrentPage(String(parseInt(currentPage) - 1));
        setOffset(offset - 10); // Decrement offset by 10 for previous page
      } catch (error) {
        console.error("Error fetching previous page data:", error);
      } finally {
      }
    }
  };

  const handlePageChange = (selectedValue) => {
    setCurrentPage(selectedValue);
    const selectedOption = pages.find(
      (option) => option.value === selectedValue
    );
    if (selectedOption) {
      setOffset(selectedOption.offset);
    }
  };
  const generatePageOptions = () => {
    const totalCount = fetchData ? fetchData.count : 0;
    const totalPages = 103;
    const options = Array.from({ length: totalPages }, (_, index) => ({
      label: `${index + 1}`,
      value: index + 1,
      offset: index * 10,
    }));

    setPages(options);
  };

  useEffect(() => {
    generatePageOptions();
  }, [fetchData]);

  useEffect(() => {
    setLoading(true);
    const fetchPokemonDetails = async () => {
      const pokemonDetails = [];
      for (const pokemon of fetchData.results) {
        try {
          const pokemonResponse = await fetch(pokemon.url);
          if (!pokemonResponse.ok) {
            throw new Error("Failed to fetch Pokemon details");
          }
          const pokemonData = await pokemonResponse.json();
          const formattedOrder = String(pokemonData.id).padStart(3, "0");

          pokemonData.dexNumber = formattedOrder;
          pokemonData.spriteDisplay =
            pokemonData.sprites.other["official-artwork"].front_default;

          // Check if dexNumber is not equal to 5 before pushing to pokemonDetails
          if (pokemonData.dexNumber.length !== 5) {
            pokemonDetails.push(pokemonData);
          }
        } catch (error) {
          setLoading(false);
          console.error(`Error fetching details for ${pokemon.name}:`, error);
        }
      }
      setLoading(false);
      console.log("pokemon details", pokemonDetails);
      setListPokemon(pokemonDetails);
    };

    if (fetchData.results) {
      fetchPokemonDetails();
    }
  }, [fetchData]);

  const [selectedType, setSelectedType] = useState("Type");
  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(event.target.value);
  };

  // Searchbar
  const [searchTermShow, setSearchTermShow] = useState("");
  const [searchTermToSearch, setSearchTermToSearch] = useState("");
  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    const lowerCase = query.toLowerCase();
    setSearchTermToSearch(lowerCase);
    setSearchTermShow(query);
  };

  const handleSearchButtonClick = async (event: {
    preventDefault: () => void;
  }) => {
    event.preventDefault();
    if (searchTermToSearch === "") {
      initialFetch();
      return;
    }

    console.log(searchTermToSearch);
    setLoading(true);
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${searchTermToSearch}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch Pokemon data");
    }
    setLoading(false);
    const data = await response.json();

    const formattedOrder = String(data.id).padStart(3, "0");

    data.dexNumber = formattedOrder;
    data.spriteDisplay = data.sprites.other["official-artwork"].front_default;

    setListPokemon([data]);
    console.log(data.name);
  };

  return (
    <div>
      <Header />
      <div
        style={{ zIndex: 10 }}
        className="px-[10px] md:px-[50px] mt-[50px] w-full h-full"
      >
        <div className="w-fit bg-pkdBlue bg-opacity-60 rounded-sm p-2 flex items-center space-x-4 ">
          <div className="h-full flex item-center space-x-2">
            <input
              onChange={handleSearchInput}
              value={searchTermShow}
              placeholder="Search "
              className=" rounded-sm tracking-widest h-8   p-1 w-full md:w-60 mina-regular shadow-sm "
            />

            <button
              type="button"
              onClick={handleSearchButtonClick}
              className="p-2 rounded-sm bg-green-500 w-8 h-8 text-white shadow-md animated hover:bg-green-600"
            >
              <FaMagnifyingGlass />
            </button>
          </div>

          <div className=" flex space-x-2 ">
            <select
              className="h-8 rounded-md mina-regular flex items-center"
              value={selectedType}
              onChange={handleTypeChange}
            >
              <option>Type</option>
              {PokemonTypes.map((type, index) => (
                <option key={index} value={type.name}>
                  {type.name}
                </option>
              ))}
            </select>
            {selectedType !== "Type" ? (
              <Image
                src={typeIcons[selectedType.toLowerCase()]}
                alt="Type"
                title={selectedType}
                className="w-8 h-8 rounded-md shadow-md"
              />
            ) : (
              <div
                title="Choose a Type"
                className="hover:cursor-default pt-1 w-8 h-8 text-white mina-regular text-lg rounded-md bg-gray-500 shadow-md flex justify-center items-center"
              >
                ?
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="w-full  flex items-center justify-center min-h-[30rem]">
        {loading ? (
          <div className="flex justify-center w-full item-center ">
            <div className="flex items-center text-[10rem] text-white">
              <AiOutlineLoading3Quarters className="animate-spin flex items-center" />
            </div>
          </div>
        ) : (
          <div className="">
            <div
              className={`w-full grid grid-cols-2 h-full  md:grid-cols-3 lg:grid-cols-5`}
            >
              {listPokemon.map((pokemon) => (
                <div
                  key={pokemon.name}
                  className={` ${
                    listPokemon.length === 1
                      ? "col-span-2  md:col-span-3 lg:col-span-5 flex justify-center"
                      : "col-span-1"
                  }`}
                >
                  <PokemonCard pokemon={pokemon} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Pagination */}
      <div className="absolute h-12 w-full mt-10">
        <Pagination
          currentPage={currentPage}
          handleNextPage={handleNextPage}
          handleMaxNextPage={handleMaxNextPage}
          handlePrevPage={handlePrevPage}
          handleMaxPrevPage={handleMaxPrevPage}
          handlePageChange={handlePageChange}
          pages={pages}
          offset={offset}
        />
      </div>
    </div>
  );
}
