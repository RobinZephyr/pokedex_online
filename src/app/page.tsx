"use client";
import Header from "@/components/home/Header";
import Pagination from "@/components/home/Pagination";
import PokemonCard from "@/components/home/PokemoCard";
import Image from "next/image";
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

  const [currentPage, setCurrentPage] = useState(1);
  const [pages, setPages] = useState([]);
  const [fetchData, setFetchData] = useState<{ results: any[] }>({
    results: [],
  });

  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState();
  const [lastPage, setLastPage] = useState(0);
  const initialFetch = async () => {
    if (selectedType !== "") {
      return;
    }

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
    setFetchData(data);
  };

  useEffect(() => {
    initialFetch();
  }, [currentPage]);

  const handleNextPage = async () => {
    if (selectedType !== "") {
      const allPokemonTypeNewpage = [];
      setCurrentPage(currentPage + 1);

      const pageNum = currentPage;

      allPokemonTypeNewpage.results = allPokemonType.results[pageNum];

      setFetchData(allPokemonTypeNewpage);
      return;
    }

    const nextPageUrl = fetchData.next;
    if (nextPageUrl) {
      try {
        const response = await fetch(nextPageUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch next page data");
        }
        const data = await response.json();
        setFetchData(data);
        setCurrentPage(currentPage + 1);
        setOffset(offset + 10); // Increment offset by 10 for next page
      } catch (error) {
        console.error("Error fetching next page data:", error);
      } finally {
      }
    }
  };

  const handleMaxNextPage = async () => {
    if (selectedType !== "") {
      const allPokemonTypeNewpage = [];
      const pageNum = lastPage - 1;
      setCurrentPage(Number(lastPage));

      allPokemonTypeNewpage.results = allPokemonType.results[pageNum];

      setFetchData(allPokemonTypeNewpage);
      return;
    }

    const nextPageUrl = fetchData.next;
    if (nextPageUrl) {
      try {
        const response = await fetch(nextPageUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch next page data");
        }
        const data = await response.json();
        setFetchData(data);
        setCurrentPage(103);
        setOffset(1020); // Increment offset by 10 for next page
      } catch (error) {
        console.error("Error fetching next page data:", error);
      } finally {
      }
    }
  };

  const handleMaxPrevPage = async () => {
    if (selectedType !== "") {
      setCurrentPage(1);

      const allPokemonTypeNewpage = [];

      allPokemonTypeNewpage.results = allPokemonType.results[0];

      setFetchData(allPokemonTypeNewpage);
      return;
    }

    const prevPageUrl = fetchData.previous;
    if (prevPageUrl) {
      try {
        const response = await fetch(prevPageUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch previous page data");
        }
        const data = await response.json();
        setFetchData(data);
        setCurrentPage(1);
        setOffset(0); // Decrement offset by 10 for previous page
      } catch (error) {
        console.error("Error fetching previous page data:", error);
      } finally {
      }
    }
  };

  const handlePrevPage = async () => {
    // setLoading(true);

    if (selectedType !== "") {
      const allPokemonTypeNewpage = [];
      const pageNum = currentPage - 2;
      setCurrentPage(currentPage - 1);

      allPokemonTypeNewpage.results = allPokemonType.results[pageNum];

      setFetchData(allPokemonTypeNewpage);
      return;
    }

    const prevPageUrl = fetchData.previous;
    if (prevPageUrl) {
      try {
        const response = await fetch(prevPageUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch previous page data");
        }
        const data = await response.json();
        setFetchData(data);
        setCurrentPage(currentPage - 1);
        setOffset(offset - 10);
      } catch (error) {
        console.error("Error fetching previous page data:", error);
      } finally {
      }
    }
  };

  // Checkpoint
  const handlePageChange = (selectedValue) => {
    if (selectedType !== "") {
      const newPage = selectedValue;
      setCurrentPage(selectedValue);

      const allPokemonTypeNewpage = [];
      const pageNum = selectedValue - 1;

      allPokemonTypeNewpage.results = allPokemonType.results[pageNum];

      setFetchData(allPokemonTypeNewpage);
      return;
    }

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
    const totalPages = selectedType === "" ? 103 : allPokemonType.count;
    const options = Array.from({ length: totalPages }, (_, index) => ({
      label: `${index + 1}`,
      value: index + 1,
      offset: index * 10,
    }));
    setLastPage(totalPages);
    setPages(options);
  };

  useEffect(() => {
    generatePageOptions();
  }, [fetchData]);

  useEffect(() => {
    setLoading(true);
    setSearchFailed("");
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

  // Searchbar
  const [searchTermShow, setSearchTermShow] = useState("");
  const [searchTermToSearch, setSearchTermToSearch] = useState("");
  const [searchFailed, setSearchFailed] = useState("");
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
    setSearchFailed("");
    setSelectedType("");
    setLastPage(1);

    const options = Array.from({ length: 1 }, (_, index) => ({
      label: `${index + 1}`,
      value: 1,
      offset: 1,
    }));
    setPages(options);

    if (searchTermToSearch === "") {
      initialFetch();
      return;
    }

    setLoading(true);
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${searchTermToSearch}`
    );
    if (!response.ok) {
      setLoading(false);
      setSearchFailed("Pokemon not found");
      return;
    }
    setLoading(false);
    const data = await response.json();

    const formattedOrder = String(data.id).padStart(3, "0");

    data.dexNumber = formattedOrder;
    data.spriteDisplay = data.sprites.other["official-artwork"].front_default;

    setListPokemon([data]);
  };

  // Type Filter
  const [selectedType, setSelectedType] = useState("");
  const [allPokemonType, setAllPokemonType] = useState([]);
  const perPage = 10;
  const handleTypeChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setLoading(true);
    setSelectedType(event.target.value);
    const type = event.target.value.toLowerCase();
    if (type !== "") {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
        if (!response.ok) {
          throw new Error("Failed to fetch Pokemon data");
        }
        const data = await response.json();
        const fetchedPokemon = [];

        const allPokemon = data.pokemon;

        if (Array.isArray(allPokemon)) {
        }

        if (Array.isArray(data.pokemon)) {
          for (const pokemon of data.pokemon) {
            try {
              const pokemonResponse = await fetch(pokemon.pokemon.url);
              if (!pokemonResponse.ok) {
                throw new Error("Failed to fetch Pokemon details");
              }
              const pokemonData = await pokemonResponse.json();
              const formattedOrder = String(pokemonData.id).padStart(3, "0");

              pokemon.dexNumber = formattedOrder;
              pokemonData.dexNumber = formattedOrder;
              if (pokemonData.dexNumber.length === 5) {
                fetchedPokemon.push(pokemonData.name);
              }
            } catch (error) {
              setLoading(false);
            }
          }

          const allPokemon = data.pokemon;

          const pokemonResults2 = data.pokemon.map(({ pokemon }) => ({
            name: pokemon.name,
            url: pokemon.url,
          }));

          const filteredPokemon = pokemonResults2.filter((pokemon) =>
            fetchedPokemon.includes(pokemon.name)
          );
          const remainingPokemon = pokemonResults2.filter(
            (pokemon) =>
              !filteredPokemon.find(
                (filtered) => filtered.name === pokemon.name
              )
          );

          const totalPages = Math.ceil(remainingPokemon.length / perPage);

          const chunkedPokemon = Array.from(
            { length: totalPages },
            (_, index) =>
              remainingPokemon.slice(index * perPage, (index + 1) * perPage)
          );
          const arrayPokemon = [];
          arrayPokemon.count = chunkedPokemon.length;
          arrayPokemon.results = chunkedPokemon;

          setCurrentPage(1);

          const firstPageData = {
            count: chunkedPokemon.length,
            results: chunkedPokemon[0] || [],
          };

          setFetchData(firstPageData);

          setAllPokemonType(arrayPokemon);
        } else {
          console.error("Pokemon data is not in the expected format.");
        }
      } catch (error) {
        console.error("Error fetching Pokemon data:", error);
      }
    } else {
      initialFetch();
    }
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
              <option value="">Type</option>
              {PokemonTypes.map((type, index) => (
                <option key={index} value={type.name}>
                  {type.name}
                </option>
              ))}
            </select>
            {/* Checkpoint */}
            {selectedType !== "" ? (
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
            <div className={`w-full `}>
              {searchFailed ? (
                <div className="flex bg-pkdBlue bg-opacity-60 p-3 rounded-md justify-center items-center text-3xl text-white mina-regular">
                  {searchFailed} ...
                </div>
              ) : (
                <div className="w-full grid grid-cols-2 h-full  md:grid-cols-3 lg:grid-cols-5">
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
              )}
            </div>
          </div>
        )}
      </div>
      {/* Pagination */}
      <div className="absolute h-12 w-full mt-10">
        <Pagination
          currentPage={currentPage}
          lastPage={lastPage}
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
