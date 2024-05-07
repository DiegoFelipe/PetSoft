"use client";

import { useToast } from "@/components/ui/use-toast";
import { Pet } from "@/lib/types";
import { createContext, useState } from "react";

export const PetContext = createContext<null | TPetContext>(null);

type PetContextProviderProps = {
  children: React.ReactNode;
  data: Pet[];
};

type TPetContext = {
  pets: Pet[];
  selectedPetId: string | null;
  handleSelectedPetId: (id: string) => void;
  handleCheckoutPet: (id: string) => void;
  handleAddPet: (newPet: Omit<Pet, "id">) => void;
  handleEditPet: (petId: string, newPet: Omit<Pet, "id">) => void;
  selectedPet: Pet | undefined;
};

export default function PetContextProvider({
  data,
  children,
}: PetContextProviderProps) {
  const { toast } = useToast();
  // state
  const [pets, setPets] = useState(data);
  const [selectedPetId, setSelectedPetId] = useState<null | string>(null);

  // derived state
  const selectedPet = pets.find((pet) => pet.id === selectedPetId);

  // event handlers / actions
  const handleAddPet = (newPet: Omit<Pet, "id">) => {
    setPets((prev) => [...prev, { ...newPet, id: Date.now().toString() }]);
  };

  const handleEditPet = (petId: string, newPetData: Omit<Pet, "id">) => {
    setPets((prev) =>
      prev.map((pet) => {
        if (pet.id === petId) {
          return {
            ...pet,
            ...newPetData,
          };
        }
        return pet;
      })
    );
  };

  const handleSelectedPetId = (id: string) => {
    setSelectedPetId(id);
  };

  const handleCheckoutPet = (id: string) => {
    toast({
      title: "Success",
      description: "Pet has been deleted",
      success: true,
    });
    setPets((prev) => prev.filter((pet) => pet.id !== id));
  };

  return (
    <PetContext.Provider
      value={{
        pets,
        selectedPetId,
        handleAddPet,
        handleSelectedPetId,
        handleEditPet,
        handleCheckoutPet,
        selectedPet,
      }}
    >
      {children}
    </PetContext.Provider>
  );
}
