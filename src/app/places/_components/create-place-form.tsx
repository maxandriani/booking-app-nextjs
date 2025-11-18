"use client";

import SaveButton from "@/components/layout/save-button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createPlace, CreateUpdatePlace } from "@/services/places/places-service";
import { useRouter } from "next/navigation";
import { BaseSyntheticEvent } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { mutate } from "swr";

export default function CreatePlaceForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting, isValid } } = useForm<CreateUpdatePlace>();
  const router = useRouter();

  function isPlaceMutateKey(key: unknown): boolean {
    if (Array.isArray(key)) {
      if (typeof key[0] === 'string')
        return key[0].startsWith('/places');
    }
    return false;
  }

  async function createPlaceHandler(data: CreateUpdatePlace, e?: BaseSyntheticEvent) {
    e?.preventDefault();
    try {
      await createPlace(data);
      await mutate(isPlaceMutateKey);
      toast.success(`${data.name} registrado!`);
      router.push('.');
    } catch (err) {
      toast.error(`Falha ao criar ${data.name}!`, { description: (err as Error).message });
    }
  }

  return (
    <form onSubmit={handleSubmit(createPlaceHandler)} className="flex flex-col gap-2">
      <Card>
        <CardContent>
          <FieldGroup>
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="name">Nome *</FieldLabel>
              {errors.name && <FieldError>{errors.name.message}</FieldError>}
              <Input aria-invalid={!!errors.name} id="name" type="text" {...register("name", { required: "Campo requerido", maxLength: 255 })} placeholder="Lugar ..." disabled={isSubmitting} />
            </Field>
            <Field data-invalid={!!errors.address}>
              <FieldLabel htmlFor="address">Endereço *</FieldLabel>
              {errors.address && <FieldError>{errors.address.message}</FieldError>}
              <Input aria-invalid={!!errors.address} id="address" type="text" {...register("address", { required: "Campo requerido", maxLength: 500 })} placeholder="Endereço ..." disabled={isSubmitting} />
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter>
          <Field orientation="horizontal">
            <SaveButton type="submit" disabled={isSubmitting || !isValid} active={isSubmitting} className="w-fit">
              {!!isSubmitting ? <span>Salvando...</span> : <span>Salvar</span>}
            </SaveButton>
          </Field>
        </CardFooter>
      </Card>
    </form>
  );
}