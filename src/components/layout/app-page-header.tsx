import { ReactNode } from "react";
import { SidebarTrigger } from "../ui/sidebar";

export interface AppPageHeaderProps {
    children: ReactNode
}

export default function AppPageHeader({ children }: AppPageHeaderProps) {
    return (
        <header className="flex gap-4 items-center p-2 pl-4 pr-4 border-b">
            <SidebarTrigger />
            <div className="flex flex-1 align-middle items-center gap-2 p-0 pl-4 pr-4 min-h-12">
                {children}
            </div>
        </header>
    )
}