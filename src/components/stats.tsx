"use client";
import { usePetContext } from "@/lib/hooks";

export default function Stats() {
  const { pets } = usePetContext();
  const numberOfPets = pets.length || 0;
  console.log("stats loading");
  return (
    <section className="text-center">
      <p className="text-2xl font-bold leading-6">{numberOfPets}</p>
      <p className="opacity-80">Current Guests</p>
    </section>
  );
}
