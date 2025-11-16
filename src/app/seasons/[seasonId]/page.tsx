import { requiresAuthenticationPolicy } from "@/actions/auth";
import AppLayout from "@/components/layout/app-layout";
import AppPageContent from "@/components/layout/app-page-content";
import AppPageHeader from "@/components/layout/app-page-header";
import AppPageTitle from "@/components/layout/app-page-title";
import AppThemeToggle from "@/components/layout/app-theme-toggle";
import { AuthenticationProvider } from "@/hooks/use-authentication";
import { getSeasonById } from "@/services/seasons/season-service";
import { Metadata } from "next";
import UpdateSeasonForm from "../_components/update-season-form";
import { Suspense } from "react";
import AppBlockLoading from "@/components/layout/app-block-loading";
import { notFound } from "next/navigation";
import AppPageHeaderBackBtn from "@/components/layout/app-page-header-back-btn";

export const metadata: Metadata = {
  title: "Cadastro de Temporadas",
  description: "Cadastre ou gerencie as temporadas de reservas.",
};

export default async function SeasonDetailPage({ params }: PageProps<'/seasons/[seasonId]'>) {
  const { seasonId } = await params;
  const session = await requiresAuthenticationPolicy(`/seasons/${seasonId}`);

  let season;

  try {
    season = await getSeasonById(seasonId);
  } catch {
    return notFound();
  }

  return (
    <AuthenticationProvider session={session}>
      <AppLayout>
        <AppPageHeader>
          <AppPageHeaderBackBtn />
          <AppPageTitle>{season.name}</AppPageTitle>
          <AppThemeToggle />
        </AppPageHeader>
        <AppPageContent>
          <Suspense fallback={<AppBlockLoading />}>
            <UpdateSeasonForm season={season} />
          </Suspense>
        </AppPageContent>
      </AppLayout>
    </AuthenticationProvider>
  )
}