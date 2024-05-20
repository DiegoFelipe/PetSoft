"use server";

import bcrypt from "bcryptjs";
import { signIn, signOut } from "@/lib/auth";
import prisma from "@/lib/db";
import { authSchema, petFormSchema, petIdSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { checkAuth, getPetById } from "@/lib/server-utils";
import { Prisma } from "@prisma/client";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// user actions

export async function logIn(prevState: unknown, formData: unknown) {
  if (!(formData instanceof FormData))
    return { message: "Invalid form data" };

  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { message: "Invalid credentials" };
        default:
          return { message: "Could not sign in" };
      }
    }
    // return { message: "Could not sign in" };
    throw error;
  }
}

export async function signUp(prevState: unknown, formData: unknown) {
  // check if formdata is FormData type
  if (!(formData instanceof FormData))
    return { message: "Invalid form data" };

  const formDataEntries = Object.fromEntries(formData.entries());

  const validatedFormData = authSchema.safeParse(formDataEntries);

  if (!validatedFormData.success) {
    return {
      message: "Invalida form data",
    };
  }
  const hashedPassword = await bcrypt.hash(
    validatedFormData.data.password,
    10
  );

  try {
    await prisma.user.create({
      data: {
        email: validatedFormData.data.email,
        hashedPassword,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.log(error.code);
      if (error.code === "P2002") {
        return { message: "Email already in use" };
      }
    }
    return { message: "Could not create user" };
  }

  await signIn("credentials", formData);
}

export async function logOut() {
  await signOut({ redirectTo: "/" });
}

// pet actions
export async function addPet(pet: unknown) {
  const session = await checkAuth();

  const validatedPet = petFormSchema.safeParse(pet);
  if (!validatedPet.success) return { message: "Invalid pet Data" };

  try {
    await prisma.pet.create({
      data: {
        ...validatedPet.data,
        User: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });
  } catch (error) {
    return {
      message: "Could not create pet.",
    };
  }
  revalidatePath("/app", "layout");
}

export async function editPet(petId: unknown, newPetData: unknown) {
  const session = await checkAuth();
  const validatedPetId = petIdSchema.safeParse(petId);
  if (!validatedPetId.success)
    return { message: "Invalid pet identifier" };

  const validatedPet = petFormSchema.safeParse(newPetData);
  if (!validatedPet.success) return { message: "Invalid pet Data" };

  const pet = await getPetById(validatedPetId.data);

  if (!pet) {
    return { message: "Pet not found" };
  }

  if (pet.userId !== session.user.id) {
    return {
      message: "Unauthorized",
    };
  }

  try {
    await prisma.pet.update({
      where: { id: validatedPetId.data },
      data: validatedPet.data,
    });
  } catch (error) {
    return {
      message: "Could not edit pet",
    };
  }
  revalidatePath("/app", "layout");
}

export async function deletePet(petId: unknown) {
  const session = await checkAuth();

  const validatedPetId = petIdSchema.safeParse(petId);
  if (!validatedPetId.success)
    return { message: "Invalid pet identifier" };

  const pet = await getPetById(validatedPetId.data);

  if (!pet) {
    return { message: "Pet not found" };
  }

  if (pet.userId !== session.user.id) {
    return {
      message: "Unauthorized",
    };
  }

  try {
    await prisma.pet.delete({ where: { id: validatedPetId.data } });
  } catch (error) {
    return {
      message: "Could not delete pet.",
    };
  }

  revalidatePath("/app", "layout");
}

// -- payment actions --------------------------------

export async function createCheckoutSession() {
  const session = await checkAuth();
  const checkoutSession = await stripe.checkout.sessions.create({
    customer_email: session.user.email,
    line_items: [
      {
        price: "price_1PI2BtEfHZBHIGpoP0kGpQuL",
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.CANONICAL_URL}/payment?success=true`,
    cancel_url: `${process.env.CANONICAL_URL}/payment?cancelled=true`,
  });
  redirect(checkoutSession.url);
}
