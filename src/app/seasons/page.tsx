import AppLayout from "@/components/layout/app-layout";
import AppPageContent from "@/components/layout/app-page-content";
import AppPageHeader from "@/components/layout/app-page-header";
import AppPageTitle from "@/components/layout/app-page-title";
import AppThemeToggle from "@/components/layout/app-theme-toggle";
import { Metadata } from "next";
import { Suspense, ViewTransition } from "react";
import { SeasonsList } from "./_components/seasons-list";
import { requiresAuthenticationPolicy } from "@/actions/auth";
import { AuthenticationProvider } from "@/hooks/use-authentication";
import SeasonsListPLaceholder from "./_components/seasons-list-placeholder";
import SeasonsActionBar from "./_components/seasons-action-bar";

export const metadata: Metadata = {
  title: "Cadastro de Temporadas",
  description: "Cadastre ou gerencie as temporadas de reservas.",
};

export default async function SeasonsPage({ }: PageProps<'/seasons'>) {
  const session = await requiresAuthenticationPolicy('/seasons');

  return (
    <AuthenticationProvider session={session}>
      <AppLayout>
        <AppPageHeader>
          <AppPageTitle>Temporadas</AppPageTitle>
          <AppThemeToggle />
        </AppPageHeader>
        <AppPageContent>
          <SeasonsActionBar />
          <ViewTransition enter="fade-in">
            <Suspense fallback={<SeasonsListPLaceholder />}>
              <SeasonsList />
            </Suspense>
          </ViewTransition>
        </AppPageContent>
      </AppLayout>
    </AuthenticationProvider>
  );
}