"use client";

import { LoaderIcon, SaveIcon } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { VariantProps } from "class-variance-authority";

export type SaveButtonProps =
  React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    active?: boolean;
  };

export default function SaveButton({ active, children, ...attrs }: SaveButtonProps) {
  return (
    <Button variant="default" {...attrs}>
      {active ? <LoaderIcon className="animate-spin" /> : <SaveIcon />}
      {children}
    </Button>
  );
}