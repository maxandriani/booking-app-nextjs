"use client";

import { Button } from "@/components/ui/button";
import { LoaderIcon, Trash } from "lucide-react";
import { MouseEventHandler } from "react";

export interface DeleteSeasonButtonProps {
  active?: boolean;
  disabled?: boolean;
  onCLick: MouseEventHandler<HTMLButtonElement>
}

export default function DeleteSeasonButton({ active, disabled, onCLick }: DeleteSeasonButtonProps) {
  return (
    <Button onClick={onCLick} variant="destructive" disabled={disabled}>
      {active ? <LoaderIcon /> : <Trash />}
    </Button>
  );
}