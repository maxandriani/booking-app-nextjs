import { ViewTransition } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/layout/app-sidebar";

export default function AppLayout({ children }: React.PropsWithChildren) {
    return (
        <ViewTransition name="app-layout" enter="slide-in">
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    {children}
                </SidebarInset>
            </SidebarProvider>
        </ViewTransition>
    )
}