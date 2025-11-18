"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SearchPlacesQuery } from "@/services/places/places-service";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { startTransition } from "react";
import { FieldValues, useForm } from "react-hook-form";

export default function PlacesFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, handleSubmit, setValue, getValues } = useForm<SearchPlacesQuery>();

  function onFilterSubmit(data: FieldValues) {
    startTransition(() => {
      const newSearchParams = new URLSearchParams(searchParams);

      if (data.search) {
        newSearchParams.set('search', data.search!);
      } else {
        newSearchParams.delete('search');
      }

      if (newSearchParams.size > 0) {
        router.push(`/seasons?${newSearchParams.toString()}`);
      } else {
        router.push('/seasons');
        router.refresh();
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onFilterSubmit)}>
      <FieldGroup className="flex w-full flex-row flex-1 align-middle items-center gap-2">
        <Field>
          <div className="relative flex items-center">
            <Input id="search" placeholder="Pesquisar..." defaultValue={searchParams.get("search")?.toString()} {...register("search")}></Input>
            {!!getValues("search") && (<Button variant="ghost" size="icon" className="absolute right-1" type="button" onClick={() => setValue("search", "")}>
              <X className="h-4 w-4" />
            </Button>)}
          </div>
        </Field>
        <Field className="w-auto">
          <Button type="submit">
            <Search />
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}