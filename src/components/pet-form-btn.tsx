import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";

type PetFormBtnProps = {
  actionType: string;
};

export default function PetFormBtn({ actionType }: PetFormBtnProps) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="mt-5 self-end"
    >
      {pending && (
        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
      )}
      {pending && actionType === "add"
        ? "Adding new Pet..."
        : actionType === "add"
        ? "Add a new Pet"
        : pending && actionType === "edit"
        ? "Saving Changes"
        : "Edit Pet"}
    </Button>
  );
}
