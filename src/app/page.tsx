"use client";
import Pagination from "@/components/home/Pagination";
import PokemonCard from "@/components/home/PokemoCard";
import SearchBar from "@/components/home/SearchBar";
import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { pokeType } from "../assets/index.ts";
import { StaticImageData } from "next/image";
import Link from "next/link";
const typeIcons: { [key: string]: string | StaticImageData } = pokeType;

interface MyPokemonType {
  id: number;
  name: string;
  url: string;
  dexNumber: string;
  spriteDisplay: string;
  sprites: {
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
  };
}

export default function Home() {
  const [listPokemon, setListPokemon] = useState<MyPokemonType[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pages, setPages] = useState<
    { label: string; value: number; offset: number }[]
  >([]);
  const [fetchData, setFetchData] = useState<{
    results: any[];
    next?: string;
    previous?: string;
    count?: number;
  }>({
    results: [],
    next: undefined,
    previous: undefined,
    count: 0,
  });

  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState();
  const [lastPage, setLastPage] = useState(0);
  const initialFetch = async () => {
    setLoading(true);
    if (selectedType === "all") {
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
    } else {
      return;
    }
  };

  useEffect(() => {
    initialFetch();
  }, [currentPage]);

  const handleNextPage = async () => {
    if (selectedType !== "all") {
      const allPokemonTypeNewpage: { results: any[] } = { results: [] };
      setCurrentPage(currentPage + 1);

      const pageNum = currentPage;

      allPokemonTypeNewpage.results = allPokemonType.results?.[pageNum];

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
        setOffset(offset + 10);
      } catch (error) {
        console.error("Error fetching next page data:", error);
      } finally {
      }
    }
  };

  const handleMaxNextPage = async () => {
    if (selectedType !== "all") {
      const allPokemonTypeNewpage: { results: any[] } = { results: [] };
      const pageNum = lastPage - 1;
      setCurrentPage(Number(lastPage));

      allPokemonTypeNewpage.results = allPokemonType.results?.[pageNum] || [];

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
        setOffset(1020);
      } catch (error) {
        console.error("Error fetching next page data:", error);
      } finally {
      }
    }
  };

  const handleMaxPrevPage = async () => {
    if (selectedType !== "all") {
      setCurrentPage(1);

      const allPokemonTypeNewpage: { results: any[] } = { results: [] };

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
        setOffset(0);
      } catch (error) {
        console.error("Error fetching previous page data:", error);
      } finally {
      }
    }
  };

  const handlePrevPage = async () => {
    if (selectedType !== "all") {
      const allPokemonTypeNewpage: { results: any[] } = { results: [] };
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

  const handlePageChange = (selectedValue: number) => {
    if (selectedType !== "all") {
      const newPage = selectedValue;
      setCurrentPage(selectedValue);

      const allPokemonTypeNewpage = { results: [] };
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
    const totalPages = selectedType === "all" ? 103 : allPokemonType.count || 0;
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
  const [selectedType, setSelectedType] = useState("all");

  useEffect(() => {
    setLoading(true);
    setSearchFailed("");
    const fetchPokemonDetails = async () => {
      const pokemonDetails: MyPokemonType[] = [];

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

  const [searchTermShow, setSearchTermShow] = useState("");
  const [searchTermToSearch, setSearchTermToSearch] = useState("");
  const [searchFailed, setSearchFailed] = useState("");
  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedType("all");
    const query = event.target.value;
    const lowerCase = query.toLowerCase();
    setSearchTermToSearch(lowerCase);
    setSearchTermShow(query);
  };

  const [toSearch, setToSearch] = useState([]);
  const handleSearchButtonClick = async (event: {
    preventDefault: () => void;
  }) => {
    event.preventDefault();
    setSearchFailed("");
    setSelectedType("all");
    setLastPage(1);

    const options = Array.from({ length: 1 }, (_, index) => ({
      label: `${index + 1}`,
      value: 1,
      offset: 1,
    }));
    setPages(options);

    if (searchTermToSearch === "") {
      setCurrentPage(1);
      setOffset(0);
      initialFetch();
      return;
    }

    if (searchTermToSearch !== "") {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${searchTermToSearch}`
      );
      if (!response.ok) {
        setLoading(false);
        setSearchFailed("Pokemon not found");
        return;
      }
      const data = await response.json();

      const formattedOrder = String(data.id).padStart(3, "0");

      data.dexNumber = formattedOrder;
      data.spriteDisplay = data.sprites.other["official-artwork"].front_default;
      setToSearch(data);
    }
  };

  useEffect(() => {
    if (toSearch) {
      setListPokemon(Array.isArray(toSearch) ? toSearch : [toSearch]);
    }
  }, [toSearch]);

  const [allPokemonType, setAllPokemonType] = useState<{
    results: any[];
    next?: string;
    count?: number;
  }>({
    results: [],
    next: undefined,
    count: 0,
  });

  const perPage = 10;
  const handleTypeChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setLoading(true);
    setSelectedType(event.target.value);
    setSearchTermShow("");
    setSearchTermToSearch("");
    const type = event.target.value.toLowerCase();

    if (type === "all") {
      setSelectedType("all");
      setCurrentPage(1);
      setOffset(0);
      initialFetch();
    } else {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
        if (!response.ok) {
          throw new Error("Failed to fetch Pokemon data");
        }
        const data = await response.json();
        const fetchedPokemon: any[] = [];

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

          const pokemonResults2 = data.pokemon.map(
            ({ pokemon }: { pokemon: MyPokemonType }) => ({
              name: pokemon.name,
              url: pokemon.url,
            })
          );

          const filteredPokemon = pokemonResults2.filter(
            (pokemon: { name: any }) => fetchedPokemon.includes(pokemon.name)
          );
          const remainingPokemon = pokemonResults2.filter(
            (pokemon: { name: any }) =>
              !filteredPokemon.find(
                (filtered: { name: any }) => filtered.name === pokemon.name
              )
          );

          const totalPages = Math.ceil(remainingPokemon.length / perPage);

          const chunkedPokemon = Array.from(
            { length: totalPages },
            (_, index) =>
              remainingPokemon.slice(index * perPage, (index + 1) * perPage)
          );
          const arrayPokemon: { count: number; results: any[] } = {
            count: chunkedPokemon.length,
            results: chunkedPokemon,
          };

          const firstPageData = {
            count: chunkedPokemon.length,
            results: chunkedPokemon[0] || [],
          };
          setCurrentPage(1);

          setFetchData(firstPageData);

          setAllPokemonType(arrayPokemon);
        } else {
          console.error("Pokemon data is not in the expected format.");
        }
      } catch (error) {
        console.error("Error fetching Pokemon data:", error);
      }
    }
  };

  useEffect(() => {
    if (selectedType === "all") {
      initialFetch();
    }
  }, [selectedType]);
  return (
    <div>
      <div
        style={{ zIndex: 10 }}
        className="px-[10px] md:px-[50px] mt-[50px] w-full h-full"
      >
        <SearchBar
          handleSearchButtonClick={handleSearchButtonClick}
          handleSearchInput={handleSearchInput}
          handleTypeChange={handleTypeChange}
          searchTermShow={searchTermShow}
          selectedType={selectedType}
          pokeType={pokeType}
        />
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
                  {listPokemon.map((pokemon: any) => (
                    <div
                      key={pokemon.name}
                      className={` ${
                        listPokemon.length === 1
                          ? "col-span-2  md:col-span-3 lg:col-span-5 flex justify-center"
                          : "col-span-1"
                      }`}
                    >
                      <Link href={`/pokemon/${pokemon.id}`}>
                        <PokemonCard pokemon={pokemon} />
                      </Link>
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
