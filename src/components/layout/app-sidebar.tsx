"use client"

import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Calendar, ChevronUp, Group, HomeIcon, LogIn, MapPin, User, Users, Wallet } from "lucide-react";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname } from "next/navigation";
import { useAuthentication } from "@/hooks/use-authentication";

export type AppSidebarProps = {
    side?: "left" | "right";
    variant?: "sidebar" | "floating" | "inset";
    collapsible?: "offcanvas" | "icon" | "none";
}

export default function AppSidebar({ ...props }: AppSidebarProps) {
    const pathname = usePathname();
    const { user } = useAuthentication();

    function isCurrentPath(path: string): boolean {
        return pathname.startsWith(path);
    }

    return (
        <Sidebar {...props}>
            <SidebarHeader>
                <span className="text-lg">Controle de Reservas</span>
            </SidebarHeader>
            <SidebarContent>
                {!!user && <>
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild isActive={pathname === '/'}>
                                        <Link href="/">
                                            <HomeIcon />
                                            <span>Dashboard</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild isActive={isCurrentPath("/bookings")}>
                                        <Link href="/bookings">
                                            <Calendar />
                                            <span>Reservas</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild isActive={isCurrentPath("/places")}>
                                        <Link href="/places">
                                            <MapPin />
                                            <span>Imóveis</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild isActive={isCurrentPath("/guests")}>
                                        <Link href="/guests">
                                            <User />
                                            <span>Hóspedes</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild isActive={isCurrentPath("/balance")}>
                                        <Link href="/balance">
                                            <Wallet />
                                            <span>Lançamentos</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild isActive={isCurrentPath("/seasons")}>
                                        <Link href="/seasons">
                                            <Group />
                                            <span>Temporadas</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild isActive={isCurrentPath("/users")}>
                                        <Link href="/users">
                                            <Users />
                                            <span>Usuários</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup></>}
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    {!user ?
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href={`/auth/login?from=${pathname}`}>
                                    <LogIn />
                                    <span>Login</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        :
                        <SidebarMenuItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <SidebarMenuButton>
                                        <div className="flex flex-1 items-center gap-4">
                                            <Avatar>
                                                <AvatarImage src="https://avatar.iran.liara.run/public" />
                                                <AvatarFallback>MA</AvatarFallback>
                                            </Avatar>
                                            <span>{user.firstName}</span>
                                        </div>
                                        <ChevronUp className="ml-auto" />
                                    </SidebarMenuButton>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                                    <DropdownMenuItem asChild>
                                        <Link href="/profile">Profile</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/auth/logout">Sign out</Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </SidebarMenuItem>
                    }
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}