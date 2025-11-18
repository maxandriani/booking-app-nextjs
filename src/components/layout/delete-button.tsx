"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { VariantProps } from "class-variance-authority";
import { LoaderIcon, Trash } from "lucide-react";

export type DeleteButtonProps =
  React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    active?: boolean;
  };

export default function DeleteButton({ active, children, ...attrs }: DeleteButtonProps) {
  return (
    <Button variant="destructive" {...attrs}>
      {active ? <LoaderIcon className="animate-spin" /> : <Trash />}
      {children}
    </Button>
  );
}