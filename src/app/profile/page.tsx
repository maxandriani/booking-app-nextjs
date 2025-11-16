import { requiresAuthenticationPolicy } from "@/actions/auth";
import AppLayout from "@/components/layout/app-layout";
import AppPageContent from "@/components/layout/app-page-content";
import AppPageHeader from "@/components/layout/app-page-header";
import AppPageTitle from "@/components/layout/app-page-title";
import AppThemeToggle from "@/components/layout/app-theme-toggle";
import { AuthenticationProvider } from "@/hooks/use-authentication";

export default async function ProfilePage() {
  const session = await requiresAuthenticationPolicy('/profile');
  return (
    <AuthenticationProvider session={session}>
      <AppLayout>
        <AppPageHeader>
          <AppPageTitle>Bem vindo, {session.user.firstName}!</AppPageTitle>
          <AppThemeToggle />
        </AppPageHeader>
        <AppPageContent>
          <p>Esta é a sua página de perfil.</p>
          <pre>{JSON.stringify(session, null, 2)}</pre>
        </AppPageContent>
      </AppLayout>
    </AuthenticationProvider>
  );
}