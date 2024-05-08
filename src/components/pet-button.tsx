"use client";
import { PlusIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PetForm from "./pet-form";
import { useState } from "react";
import { flushSync } from "react-dom";

type PetButtonProps = {
  actionType: Actions;
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
};
export type Actions = "edit" | "checkout" | "add";

export default function PetButton({
  actionType,
  onClick,
  children,
  disabled,
}: PetButtonProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  if (actionType === "add" || actionType === "edit") {
    return (
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogTrigger asChild>
          {actionType === "add" ? (
            <Button size="icon" className="rounded-full">
              <PlusIcon className="h-6 w-6" />
            </Button>
          ) : (
            <Button variant="secondary">{children}</Button>
          )}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "add" ? "Add a new Pet" : "Edit Pet"}
            </DialogTitle>
            <PetForm
              actionType={actionType}
              onFormSubmission={() =>
                flushSync(() => {
                  setIsFormOpen(false);
                })
              }
            />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  } else if (actionType === "checkout") {
    return (
      <Button
        variant="secondary"
        disabled={disabled}
        onClick={onClick}
      >
        {children}
      </Button>
    );
  }
}
