"use client";
import { usePetContext } from "@/lib/hooks";
import { Pet } from "@/lib/types";
import Image from "next/image";
import PetButton from "./pet-button";

export default function PetDetails() {
  const { selectedPet } = usePetContext();

  return (
    <section className="h-full w-full flex flex-col">
      {!selectedPet ? (
        <div className="h-full flex justify-center items-center">
          <EmptyView />
        </div>
      ) : (
        <>
          <TopBar selectedPet={selectedPet} />
          <OtherInfo selectedPet={selectedPet} />
          <Notes selectedPet={selectedPet} />
        </>
      )}
    </section>
  );
}

function TopBar({ selectedPet }: { selectedPet: Pet }) {
  const { handleCheckoutPet } = usePetContext();
  return (
    <div className="flex items-center bg-white px-8 py-5 border-b border-light">
      <Image
        src={selectedPet.imageUrl}
        alt="Selected pet image"
        height={75}
        width={75}
        className="h-[75px] w-[75px] rounded-full object-cover"
      />
      <h2 className="text-3xl font-semibold leading-7 ml-5">
        {selectedPet.name}
      </h2>

      <div className="ml-auto space-x-3">
        <PetButton actionType="edit">Edit</PetButton>
        <PetButton
          actionType="checkout"
          onClick={async () =>
            await handleCheckoutPet(selectedPet.id)
          }
        >
          Checkout
        </PetButton>
      </div>
    </div>
  );
}

function OtherInfo({ selectedPet }: { selectedPet: Pet }) {
  return (
    <div className="flex justify-around py-10 px-5 text-center">
      <div>
        <h3 className="text-[13px] font-medium uppercase text-zinc-700">
          Owner name
        </h3>
        <p className="mt-1 text-lg text-zinc-800">
          {selectedPet?.ownerName}
        </p>
      </div>
      <div>
        <h3 className="text-[13px] font-medium uppercase text-zinc-700">
          Age
        </h3>
        <p className="mt-1 text-lg text-zinc-800">
          {selectedPet?.age}
        </p>
      </div>
    </div>
  );
}

function Notes({ selectedPet }: { selectedPet: Pet }) {
  return (
    <section className="flex-1 bg-white px-7 py-5 rounded-md mb-9 mx-8 border boder-light">
      {selectedPet?.notes}
    </section>
  );
}

function EmptyView() {
  return (
    <section className="m-auto hover:animate-background rounded-xl bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 p-0.5 shadow-xl transition hover:bg-[length:400%_400%] hover:shadow-sm hover:[animation-duration:_4s]">
      <div className="rounded-[10px] bg-white p-5 sm:p-10">
        <a href="#">
          <h3 className="mt-0.5 text-lg font-medium text-gray-900">{`It's empty here...`}</h3>
        </a>

        <div className="mt-4 flex flex-wrap gap-1">
          <p>Try selecting or adding a pet</p>
        </div>
      </div>
    </section>
  );
}
