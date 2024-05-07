import AppFooter from "@/components/app-footer";
import AppHeader from "@/components/app-header";
import BackgroundPattern from "@/components/background-pattern";
import PetContextProvider from "@/contexts/pet-context-provider";
import SearchContextProvider from "@/contexts/search-context-provider";
import { Pet } from "@/lib/types";

export default async function layout({ children }: { children: React.ReactNode }) {
  const res = await fetch(`https://bytegrad.com/course-assets/projects/petsoft/api/pets`);
  if (!res.ok) {
    throw new Error("Could not fetch pets");
  }
  const data: Pet[] = await res.json();

  return (
    <>
      <BackgroundPattern />
      <div className="max-w-[1050px] mx-auto px-4 flex flex-col min-h-screen">
        <AppHeader />
        <PetContextProvider data={data}>
          <SearchContextProvider>{children}</SearchContextProvider>
        </PetContextProvider>
        <AppFooter />
      </div>
    </>
  );
}