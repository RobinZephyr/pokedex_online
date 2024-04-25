"use client";
import Header from "@/components/home/Header";
import Pagination from "@/components/home/Pagination";
import PokemonCard from "@/components/home/PokemoCard";
import SearchBar from "@/components/home/SearchBar";
import { IoIosArrowBack } from "react-icons/io";
import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

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

    console.log(data);
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
  const generatePageOptions = () => {
    const totalCount = fetchData ? fetchData.count : 0;
    const totalPages = Math.ceil(totalCount / 10);
    const options = Array.from({ length: totalPages }, (_, index) => ({
      label: `${index + 1}`,
      value: index + 1,
      offset: index * 10,
    }));
    setPages(options);
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
          console.log(
            pokemonData.sprites.other["official-artwork"].front_default
          );

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
      setListPokemon(pokemonDetails);
    };

    if (fetchData.results) {
      fetchPokemonDetails();
    }
  }, [fetchData]);

  return (
    <div>
      <Header />
      <div
        style={{ zIndex: 10 }}
        className="px-[10px] md:px-[50px] mt-[50px] w-full h-full"
      >
        <SearchBar />

        {loading ? (
          <div className="flex justify-center w-full item-center h-[20rem]">
            <div className="flex items-center text-[10rem] text-white">
              <AiOutlineLoading3Quarters className="animate-spin flex items-center" />
            </div>
          </div>
        ) : (
          <div className="h-full">
            <div className="h-full"></div>
            <div className="w-full grid grid-cols-2 h-full  md:grid-cols-3 lg:grid-cols-5">
              {" "}
              {listPokemon.map((pokemon) => (
                <PokemonCard key={pokemon.name} pokemon={pokemon} />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="absolute h-12 w-full mt-10">
        <div className="bg-white flex justify-center inset h-full w-full  bottom-0 flex items-center ">
          <div className="space-x-2 bg-pkdBlue bg-opacity-50 p-1 rounded-sm shadow-md flex items-center h-fit">
            <button
              className={`bg-green-500 flex justify-center items-center hover:bg-green-700 animated text-green-500 rounded-sm w-6 h-6 ${
                currentPage === "1" ? "cursor-not-allowed opacity-50" : ""
              }`}
              onClick={handlePrevPage}
              disabled={currentPage === "1"} // Disable the button based on currentPage value
            >
              <div className="bg-white w-5 h-5 rounded-full flex justify-center items-center text-lg">
                <IoIosArrowBack />
              </div>
            </button>

            <div className="w-10 text-center mina-regular bg-white rounded-sm shadow-md flex items-center justify-center pt-[.5px]">
              <select
                value={currentPage}
                onChange={(e) => handlePageChange(Number(e.target.value))}
              >
                {pages.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              className="bg-green-500 flex justify-center items-center hover:bg-green-700 animated text-green-500 rounded-sm w-6 h-6"
              onClick={handleNextPage}
              disabled={parseInt(currentPage) >= pages.length}
            >
              <div
                style={{ transform: "rotate(180deg)" }}
                className="bg-white w-5 h-5 rounded-full flex justify-center items-center text-lg"
              >
                <IoIosArrowBack />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
