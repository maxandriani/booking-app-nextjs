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
import CreateSeasonForm from "../_components/create-season-form";

export const metadata: Metadata = {
  title: "Nova Temporada",
  description: "Criar uma nova temporada.",
};

export default async function SeasonDetailPage({ }: PageProps<'/seasons/new'>) {
  const session = await requiresAuthenticationPolicy(`/seasons/new`);

  return (
    <AuthenticationProvider session={session}>
      <AppLayout>
        <AppPageHeader>
          <AppPageHeaderBackBtn />
          <AppPageTitle>Nova Temporada</AppPageTitle>
          <AppThemeToggle />
        </AppPageHeader>
        <AppPageContent>
          <Suspense fallback={<AppBlockLoading />}>
            <CreateSeasonForm />
          </Suspense>
        </AppPageContent>
      </AppLayout>
    </AuthenticationProvider>
  )
}