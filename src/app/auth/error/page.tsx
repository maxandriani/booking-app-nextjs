import AppPageContent from "@/components/layout/app-page-content";
import AppPageHeader from "@/components/layout/app-page-header";
import AppPageTitle from "@/components/layout/app-page-title";
import Link from "next/link";

export default async function ErrorPage({ searchParams }: PageProps<'/auth/error'>) {
    const { error, error_description, from } = await searchParams;

    return (
        <>
            <AppPageHeader>
                <AppPageTitle>Falha ao autenticar</AppPageTitle>
            </AppPageHeader>
            <AppPageContent>
                <p>{error}</p>
                <p>{error_description}</p>
                <Link href={`/auth/login?from=${from}`}>Tentar novamente</Link>
            </AppPageContent>
        </>
    )
}