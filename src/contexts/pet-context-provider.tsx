"use client";

import { useToast } from "@/components/ui/use-toast";
import { Pet } from "@/lib/types";
import { createContext, useState } from "react";

export const PetContext = createContext<null | TPetContext>(null);

type PetContextProviderProps = {
  children: React.ReactNode;
  data: Pet[];
  handleAddPet: (newPet: Pet) => void;
};

type TPetContext = {
  pets: Pet[];
  selectedPetId: string | null;
  handleSelectedPetId: (id: string) => void;
  handleCheckoutPet: (id: string) => void;
  selectedPet: Pet | undefined;
};

export default function PetContextProvider({ data, children }: PetContextProviderProps) {
  const { toast } = useToast();
  // state
  const [pets, setPets] = useState(data);
  const [selectedPetId, setSelectedPetId] = useState<null | string>(null);

  // derived state
  const selectedPet = pets.find((pet) => pet.id === selectedPetId);

  // event handlers / actions
  const handleAddPet = (newPet: Pet) => {
    setPets((prev) => [...prev, newPet]);
  };

  const handleSelectedPetId = (id: string) => {
    setSelectedPetId(id);
  };

  const handleCheckoutPet = (id: string) => {
    toast({ title: "Success", description: "Pet has been deleted", success: true });
    setPets((prev) => prev.filter((pet) => pet.id !== id));
  };

  return (
    <PetContext.Provider
      value={{
        pets,
        selectedPetId,
        handleAddPet,
        handleSelectedPetId,
        handleCheckoutPet,
        selectedPet,
      }}
    >
      {children}
    </PetContext.Provider>
  );
}
