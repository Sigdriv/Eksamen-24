import Link from "next/link";
import React from "react";
import { Button } from "./button";

export default function NavBar() {
  return (
    // <div>
    //   <nav>
    //     <ul>
    //       <li>
    //         <a href="/topology">Network Topology</a>
    //       </li>
    //       <li>
    //         <a href="/dhcp">DHCP Simulation</a>
    //       </li>
    //     </ul>
    //   </nav>
    // </div>
    <nav className="flex items-center justify-evenly w-screen bg-slate-200 py-2">
      <div className="flex items-center justify-evenly w-screen">
        <Link href="/">Hjem </Link>
        <Link href="/topology">Netverks topologi</Link>
        <Link href="/dhcp">DHCP Simulation</Link>
      </div>
    </nav>
  );
}
