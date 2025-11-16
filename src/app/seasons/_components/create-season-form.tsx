"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createSeason, CreateSeason } from "@/services/seasons/season-service";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { mutate } from "swr";

function isSeasonMutateKey(key: unknown): boolean {
  if (Array.isArray(key)) {
    if (typeof key[0] === 'string')
      return key[0].startsWith('/seasons');
  }
  return false;
}

export default function CreateSeasonForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CreateSeason>();
  const router = useRouter();

  async function updateSeason(data: CreateSeason, e) {
    e.preventDefault();
    try {
      await createSeason(data);
      await mutate(isSeasonMutateKey);
      toast.success(`${data.name} registrado!`);
      router.push('./');
    } catch (err) {
      toast.error(`Falha ao criar ${data.name}!`, { description: (err as Error).message });
    }
  }

  return (
    <form onSubmit={handleSubmit(updateSeason)} className="flex flex-col gap-2">
      <Card>
        <CardContent>
          <FieldGroup>
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="name">Nome *</FieldLabel>
              {errors.name && <FieldError>{errors.name.message}</FieldError>}
              <Input aria-invalid={!!errors.name} id="name" type="text" {...register("name", { required: "Campo requerido", maxLength: 255 })} placeholder="Temporada ..." disabled={isSubmitting} />
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter>
          <FieldGroup orientation="horizontal">
            <Field className="w-fit">
              <Button type="submit" disabled={isSubmitting}>
                {!!isSubmitting
                  ? <>
                    <Loader2Icon className="animate-spin" />
                    <span>Salvando...</span>
                  </>
                  : <span>Salvar</span>}
              </Button>
            </Field>
          </FieldGroup>
        </CardFooter>
      </Card>
    </form>
  )
}