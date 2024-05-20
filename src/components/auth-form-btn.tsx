"use client";
import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";

type AuthFormBtnProps = {
  type: "logIn" | "signUp";
};

export default function AuthFormBtn({ type }: AuthFormBtnProps) {
  const { pending } = useFormStatus();
  return (
    <Button className="mt-4" disabled={pending}>
      {pending && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
      {type === "logIn" ? "Log In" : "Sign Up"}
    </Button>
  );
}
