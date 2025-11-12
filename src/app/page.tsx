import { requiresAuthenticationPolicy } from "@/actions/auth";
import AppLayout from "@/components/layout/app-layout";
import AppPageContent from "@/components/layout/app-page-content";
import AppPageHeader from "@/components/layout/app-page-header";
import AppPageTitle from "@/components/layout/app-page-title";
import AppThemeToggle from "@/components/layout/app-theme-toggle";

export default async function Home() {

  const session = await requiresAuthenticationPolicy('/');
  
  return (
    <AppLayout>
      <AppPageHeader>
        <AppPageTitle>Gerenciador de Reservas</AppPageTitle>
        <AppThemeToggle />
      </AppPageHeader>
      <AppPageContent>
        <p>Bem vindo {session.user.firstName}</p>
      </AppPageContent>
    </AppLayout>
  );
}
