'use client';

import Navbar from "@/components/NavBar";


export default function Forge(){
  return(
    <>
    <Navbar/>
    <div className="w-1/4 bg-darkgreen-100 overflow-y-auto p-4 m-left-4">
    <h1 className ='text-lg font-bold'>About</h1>
    <br></br>
    <p>Text Adventure games (also known as Interactive Fiction) are an ideal way to “gamify” learning. This is an engaging and fun way to introduce many topics and sub-topics, especially History!

The long-term vision of this website, is that many educators will contribute content that can be used by any other educator.</p>
    <br></br>

    <h2 className="text-gray-500 text-sm">Project was made by following persons: </h2>
    
    <ul>
      <li>Lior Subotnick</li>
      <li>James Pomares</li>
      <li>Dmitry Uvarov</li>
    </ul>
    </div>
    </>
  )
}