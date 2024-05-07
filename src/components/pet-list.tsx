"use client";

import { usePetContext, useSearchContext } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useMemo } from "react";

export default function PetList() {
  const { pets, handleSelectedPetId, selectedPetId } = usePetContext();
  const { searchText } = useSearchContext();

  const filteredPets = useMemo(
    () => pets.filter((pet) => pet.name.toLowerCase().includes(searchText.toLowerCase())),
    [pets, searchText]
  );

  return (
    <ul className="bg-white border-b border-black/[0.08]">
      {filteredPets.map((pet) => (
        <li key={pet.id}>
          <button
            onClick={() => handleSelectedPetId(pet.id)}
            className={cn(
              "hover:bg-[#EFF1f2] focus:bg-[#EFF1f2] px-5 text-base gap-3 flex items-center h-[70px] w-full cursor-pointer",
              {
                "bg-[#EFF1f2]": selectedPetId === pet.id,
              }
            )}
          >
            <Image
              src={pet.imageUrl}
              alt="pet photo"
              width={45}
              height={45}
              className=" w-[45px] h-[45px] rounded-full object-cover"
            />
            <p className="font-semibold">{pet.name}</p>
          </button>
        </li>
      ))}
    </ul>
  );
}
