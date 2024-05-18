"use client";

import { addPet, deletePet, editPet } from "@/actions/actions";
import { toast } from "sonner";

import { createContext, useOptimistic, useState } from "react";
import { Pet } from "@prisma/client";
import { PetEssentials } from "@/lib/types";

export const PetContext = createContext<null | TPetContext>(null);

type PetContextProviderProps = {
  children: React.ReactNode;
  data: Pet[];
};

type TPetContext = {
  pets: Pet[];
  selectedPetId: Pet["id"] | null;
  handleSelectedPetId: (id: Pet["id"]) => void;
  handleCheckoutPet: (id: Pet["id"]) => Promise<void>;
  handleAddPet: (newPet: PetEssentials) => Promise<void>;
  handleEditPet: (
    petId: Pet["id"],
    newPet: PetEssentials
  ) => Promise<void>;
  selectedPet: Pet | undefined;
};

export default function PetContextProvider({
  data,
  children,
}: PetContextProviderProps) {
  // state
  const [optimisticPets, setOptimisticPets] = useOptimistic(
    data,
    (state, { action, payload }) => {
      switch (action) {
        case "add":
          return [
            ...state,
            { ...payload, id: Math.random().toString() },
          ];
        case "edit":
          return state.map((pet) => {
            if (pet.id === payload.id) {
              return { ...pet, ...payload.newPetData };
            }
            return pet;
          });
        case "delete":
          return state.filter((pet) => pet.id !== payload);
        default:
          return state;
      }
    }
  );
  const [selectedPetId, setSelectedPetId] = useState<null | string>(
    null
  );

  // derived state
  const selectedPet = optimisticPets.find(
    (pet) => pet.id === selectedPetId
  );

  // event handlers / actions
  const handleAddPet = async (newPet: PetEssentials) => {
    setOptimisticPets({ action: "add", payload: newPet });
    const error = await addPet(newPet);
    if (error) {
      toast.warning(error.message);
      return;
    }
  };

  const handleEditPet = async (
    petId: Pet["id"],
    newPetData: PetEssentials
  ) => {
    setOptimisticPets({
      action: "edit",
      payload: { id: petId, newPetData },
    });
    const error = await editPet(petId, newPetData);
    if (error) {
      toast.error(error.message);
      return;
    }
  };

  const handleSelectedPetId = (id: Pet["id"]) => {
    setSelectedPetId(id);
  };

  const handleCheckoutPet = async (petId: Pet["id"]) => {
    setOptimisticPets({
      action: "delete",
      payload: petId,
    });
    toast.success("Pet has been deleted");
    const error = await deletePet(petId);
    if (error) {
      toast.error(error.message);
      return;
    }
  };

  return (
    <PetContext.Provider
      value={{
        pets: optimisticPets,
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
