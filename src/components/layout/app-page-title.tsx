import { ReactNode } from "react";

export interface AppPageTitleProps {
    children: ReactNode
}

export default function AppPageTitle({ children }: AppPageTitleProps) {
    return (
        <h1 className="text-2xl font-light w-full">{children}</h1>
    )
}