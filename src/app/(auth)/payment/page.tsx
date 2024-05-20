"use client";
import { createCheckoutSession } from "@/actions/actions";
import H1 from "@/components/h1";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, ReloadIcon } from "@radix-ui/react-icons";
import React, { useTransition } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const [isPending, startTransition] = useTransition();
  const { data: session, update, status } = useSession();
  const router = useRouter();

  return (
    <main className="flex flex-col items-center space-y-10">
      {!searchParams.success && <H1>PetSoft access required payment</H1>}

      {searchParams.success && (
        <Button
          className="rounded-2xl bg-green-400 text-black hover:bg-green-500"
          onClick={async () => {
            await update(true);
            router.push("/app/dashboard");
          }}
          disabled={status === "loading"}
        >
          Access PetSoft
          <ArrowRightIcon className="ml-5 animate-ping" />
        </Button>
      )}

      {!searchParams.success && (
        <Button
          disabled={isPending}
          onClick={() =>
            startTransition(async () => await createCheckoutSession())
          }
        >
          {isPending && <ReloadIcon className="mr-2 animate-spin" />}
          Buy access for $299
        </Button>
      )}
      {searchParams.success && (
        <p className="text-green-700 text-sm">
          Payment successful! You now have lifetime access to PetSoft
        </p>
      )}
      {searchParams.cancelled && (
        <p className="text-red-700 text-sm">
          Payment cancelled. You can try again!
        </p>
      )}
    </main>
  );
}
