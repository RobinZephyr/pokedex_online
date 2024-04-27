import Link from "next/link";
import React from "react";

function Header() {
  return (
    <div
      style={{ zIndex: 10 }}
      className="h-[80px] bg-white rounded-b-md shadow-sm px-[60px] items-center flex border-b-yellow-300 border-b-4"
    >
      <Link href="/">
        <span className="julius text-5xl flex items-center">Pokédex</span>
      </Link>
    </div>
  );
}

export default Header;
