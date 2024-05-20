"use client";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { logIn, signUp } from "@/actions/actions";
import AuthFormBtn from "./auth-form-btn";
import { useFormState } from "react-dom";
import { toast } from "sonner";

type AuthFormProps = {
  type: "logIn" | "signUp";
};

export default function AuthForm({ type }: AuthFormProps) {
  const [signUpError, dispatch] = useFormState(
    type === "logIn" ? logIn : signUp,
    undefined
  );

  if (signUpError) {
    toast.warning(signUpError.message);
  }
  return (
    <form action={dispatch}>
      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required></Input>
      </div>
      <div className="mb-4 mt-2 space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" required></Input>
      </div>
      <AuthFormBtn type={type} />
    </form>
  );
}
