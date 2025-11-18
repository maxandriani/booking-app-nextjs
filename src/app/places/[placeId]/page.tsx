import { requiresAuthenticationPolicy } from "@/actions/auth";
import AppLayout from "@/components/layout/app-layout";
import AppPageContent from "@/components/layout/app-page-content";
import AppPageHeader from "@/components/layout/app-page-header";
import AppPageTitle from "@/components/layout/app-page-title";
import AppThemeToggle from "@/components/layout/app-theme-toggle";
import { AuthenticationProvider } from "@/hooks/use-authentication";
import { Metadata } from "next";
import { Suspense } from "react";
import AppBlockLoading from "@/components/layout/app-block-loading";
import { notFound } from "next/navigation";
import AppPageHeaderBackBtn from "@/components/layout/app-page-header-back-btn";
import { getPlaceById } from "@/services/places/places-service";
import UpdatePlaceForm from "../_components/update-place-form";

export const metadata: Metadata = {
  title: "Cadastro de Imóveis",
  description: "Cadastre ou gerencie seus imóveis para locação.",
};

export default async function PlaceDetailPage({ params }: PageProps<'/places/[placeId]'>) {
  const { placeId } = await params;
  const session = await requiresAuthenticationPolicy(`/places/${placeId}`);

  let place;

  try {
    place = await getPlaceById(placeId);
  } catch {
    return notFound();
  }

  return (
    <AuthenticationProvider session={session}>
      <AppLayout>
        <AppPageHeader>
          <AppPageHeaderBackBtn />
          <AppPageTitle>{place.name}</AppPageTitle>
          <AppThemeToggle />
        </AppPageHeader>
        <AppPageContent>
          <Suspense fallback={<AppBlockLoading />}>
            <UpdatePlaceForm place={place} />
          </Suspense>
        </AppPageContent>
      </AppLayout>
    </AuthenticationProvider>
  )
}