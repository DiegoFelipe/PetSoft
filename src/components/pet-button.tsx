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

type PetButtonProps = {
  actionType: Actions;
  children?: React.ReactNode;
  onClick?: () => void;
};
export type Actions = "edit" | "checkout" | "add";

export default function PetButton({ actionType, onClick, children }: PetButtonProps) {
  if (actionType === "add" || actionType === "edit") {
    return (
      <Dialog>
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
            <DialogTitle>{actionType === "add" ? "Add a new Pet" : "Edit Pet"}</DialogTitle>
            <PetForm actionType={actionType} />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  } else if (actionType === "checkout") {
    return (
      <Button variant="secondary" onClick={onClick}>
        {children}
      </Button>
    );
  }
}
