"use client";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { CreateUpdatePlace, Place, updatePlaceById } from "@/services/places/places-service";
import { deleteSeasonById } from "@/services/seasons/season-service";
import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { mutate } from "swr";

export interface UpdatePlaceFormProps {
  place: Place;
}

function isPlaceMutateKey(key: unknown): boolean {
  if (Array.isArray(key)) {
    if (typeof key[0] === 'string')
      return key[0].startsWith('/places');
  }
  return false;
}

export default function UpdatePlaceForm({ place }: UpdatePlaceFormProps) {
  const { register, handleSubmit, formState: { errors: fieldErrors, isSubmitting, isValid, disabled } } = useForm<CreateUpdatePlace>();
  const [isRemoving, setIsRemoving] = useState(false);
  const router = useRouter();

  async function updatePlace(data: CreateUpdatePlace) {
    try {
      await updatePlaceById(place.id, data);
      await mutate(isPlaceMutateKey);
      toast.success(`${data.name} atualizado!`);
      router.refresh();
    } catch (err) {
      toast.error(`Falha ao atualizar ${place.name}!`, { description: (err as Error).message });
    }
  }

  async function removePlace() {
    startTransition(() => setIsRemoving(true));
    try {
      await deleteSeasonById(place.id);
      await mutate(isPlaceMutateKey);
      toast.success(`${place.name} removido!`);
      router.push('./');
    } catch (err) {
      toast.error(`Falha ao atualizar ${place.name}!`, { description: (err as Error).message });
    } finally {
      startTransition(() => setIsRemoving(false));
    }
  }

  return (
    <form onSubmit={handleSubmit(updatePlace)} className="flex flex-col gap-2">
      <Card>
        <CardHeader className="border-b">
          <CardTitle>{place.name}</CardTitle>
          <CardDescription>Criado por {place.created_by.name} em {new Date(place.created_at).toLocaleDateString()}</CardDescription>
          <CardAction>
            <Button variant="destructive" type="button" onClick={removePlace} disabled={isRemoving || isSubmitting}>
              <TrashIcon />
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field data-invalid={!!fieldErrors.name}>
              <FieldLabel>Nome</FieldLabel>
              {fieldErrors.name && <FieldError>{fieldErrors.name.message}</FieldError>}
              <Input type="text" aria-invalid={!!fieldErrors.name} {...register("name", { required: "Campo requerido.", maxLength: 255 })} placeholder="Temporada ..." defaultValue={place.name} disabled={disabled || isSubmitting || isRemoving} />
            </Field>
            <Field data-invalid={!!fieldErrors.name}>
              <FieldLabel>Endereço</FieldLabel>
              {fieldErrors.address && <FieldError>{fieldErrors.address.message}</FieldError>}
              <Input type="text" aria-invalid={!!fieldErrors.address} {...register("address", { required: "Campo requerido.", maxLength: 255 })} placeholder="Temporada ..." defaultValue={place.address} disabled={disabled || isSubmitting || isRemoving} />
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter>
          <Field orientation="horizontal">
            <Button className="w-fit" type="submit" disabled={disabled || isSubmitting || isRemoving || !isValid}>
              {!!isSubmitting ? <span>Salvando...</span> : <span>Salvar</span>}
            </Button>
          </Field>
        </CardFooter>
      </Card>
    </form >
  )
}