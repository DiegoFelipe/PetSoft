import { Actions } from "./pet-button";
import { Button } from "./ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";

type PetFormBtnProps = {
  actionType: Actions;
};

export default function PetFormBtn({ actionType }: PetFormBtnProps) {
  return (
    <Button type="submit" className="mt-5 self-end">
      {actionType === "add" ? "Add a new Pet" : "Edit pet"}
    </Button>
  );
}
