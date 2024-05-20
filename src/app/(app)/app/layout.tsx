import AppFooter from "@/components/app-footer";
import AppHeader from "@/components/app-header";
import BackgroundPattern from "@/components/background-pattern";
import PetContextProvider from "@/contexts/pet-context-provider";
import SearchContextProvider from "@/contexts/search-context-provider";
import { checkAuth, getPetByUserId } from "@/lib/server-utils";

export default async function layout({ children }: { children: React.ReactNode }) {
  const session = await checkAuth();

  const pets = await getPetByUserId(session.user.id);

  return (
    <>
      <BackgroundPattern />
      <div className="max-w-[1050px] mx-auto px-4 flex flex-col min-h-screen">
        <AppHeader />
        <PetContextProvider data={pets}>
          <SearchContextProvider>{children}</SearchContextProvider>
        </PetContextProvider>
        <AppFooter />
      </div>
    </>
  );
}
