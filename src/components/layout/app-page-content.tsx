import { ReactNode } from "react";

export interface AppPageContentProps {
    children?: ReactNode
}

export default function AppPageContent({ children }: AppPageContentProps) {
    return (
        <main className="flex flex-col gap-4 p-4">
            {children}
        </main>
    )
}