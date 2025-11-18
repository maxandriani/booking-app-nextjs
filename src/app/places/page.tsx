import { requiresAuthenticationPolicy } from "@/actions/auth";
import AppLayout from "@/components/layout/app-layout";
import AppPageContent from "@/components/layout/app-page-content";
import AppPageHeader from "@/components/layout/app-page-header";
import AppPageTitle from "@/components/layout/app-page-title";
import AppThemeToggle from "@/components/layout/app-theme-toggle";
import { AuthenticationProvider } from "@/hooks/use-authentication";
import { Suspense, ViewTransition } from "react";
import PlacesActionBar from "./_components/places-action-bar";
import PlacesListPLaceholder from "./_components/places-list-placeholder";
import { PlacesList } from "./_components/places-list";

export default async function PlacesPage({ }: PageProps<'/places'>) {
  const session = await requiresAuthenticationPolicy('/places');

  return (
    <AuthenticationProvider session={session}>
      <AppLayout>
        <AppPageHeader>
          <AppPageTitle>Locais</AppPageTitle>
          <AppThemeToggle />
        </AppPageHeader>
        <AppPageContent>
          <PlacesActionBar />
          <ViewTransition enter="fade-in">
            <Suspense fallback={<PlacesListPLaceholder />}>
              <PlacesList />
            </Suspense>
          </ViewTransition>
        </AppPageContent>
      </AppLayout>
    </AuthenticationProvider>
  );
}
