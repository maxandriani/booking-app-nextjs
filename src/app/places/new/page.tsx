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
import AppPageHeaderBackBtn from "@/components/layout/app-page-header-back-btn";
import CreatePlaceForm from "../_components/create-place-form";

export const metadata: Metadata = {
  title: "Novo Imóvel",
  description: "Criar um novo imóvel.",
};

export default async function SeasonDetailPage({ }: PageProps<'/places/new'>) {
  const session = await requiresAuthenticationPolicy(`/seasons/new`);

  return (
    <AuthenticationProvider session={session}>
      <AppLayout>
        <AppPageHeader>
          <AppPageHeaderBackBtn />
          <AppPageTitle>Novo Imóvel</AppPageTitle>
          <AppThemeToggle />
        </AppPageHeader>
        <AppPageContent>
          <Suspense fallback={<AppBlockLoading />}>
            <CreatePlaceForm />
          </Suspense>
        </AppPageContent>
      </AppLayout>
    </AuthenticationProvider>
  )
}