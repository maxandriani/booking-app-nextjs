"use client";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { CreateSeason, deleteSeasonById, Season, updateSeasonById } from "@/services/seasons/season-service";
import { Loader2Icon, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";
import { FieldErrors, useForm } from "react-hook-form";
import { toast } from "sonner";
import { mutate } from "swr";

export interface SeasonFormProps {
  season: Season;
  disabled?: boolean;
  errors?: FieldErrors<CreateSeason>
}

function isSeasonMutateKey(key: unknown): boolean {
  if (Array.isArray(key)) {
    if (typeof key[0] === 'string')
      return key[0].startsWith('/seasons');
  }
  return false;
}

export default function UpdateSeasonForm({ season, disabled, errors }: SeasonFormProps) {
  const { register, handleSubmit, formState: { errors: fieldErrors, isSubmitting } } = useForm<CreateSeason>({ errors });
  const [isRemoving, setIsRemoving] = useState(false);
  const router = useRouter();

  async function updateSeason(data: CreateSeason) {
    try {
      await updateSeasonById(season.id, data);
      await mutate(isSeasonMutateKey);
      toast.success(`${data.name} atualizado!`);
      router.refresh();
    } catch (err) {
      toast.error(`Falha ao atualizar ${season.name}!`, { description: (err as Error).message });
    }
  }

  async function removeSession() {
    startTransition(() => setIsRemoving(true));
    try {
      await deleteSeasonById(season.id);
      await mutate(isSeasonMutateKey);
      toast.success(`${season.name} removido!`);
      router.push('./');
    } catch (err) {
      toast.error(`Falha ao atualizar ${season.name}!`, { description: (err as Error).message });
    } finally {
      startTransition(() => setIsRemoving(false));
    }
  }

  return (
    <form onSubmit={handleSubmit(updateSeason)} className="flex flex-col gap-2">
      <Card>
        <CardHeader className="border-b">
          <CardTitle>{season.name}</CardTitle>
          <CardDescription>Criado por {season.created_by.name} em {new Date(season.created_at).toLocaleDateString()}</CardDescription>
          <CardAction>
            <Button variant="destructive" type="button" onClick={removeSession} disabled={isRemoving || isSubmitting}>
              <TrashIcon />
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel>Nome</FieldLabel>
              <Input type="text" {...register("name", { required: true, maxLength: 255 })} placeholder="Temporada ..." defaultValue={season.name} disabled={disabled || isSubmitting || isRemoving} />
              {fieldErrors.name && <FieldError>{fieldErrors.name.message}</FieldError>}
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter>
          <FieldGroup orientation="horizontal">
            <Field className="w-fit">
              <Button type="submit" disabled={disabled || isSubmitting || isRemoving}>
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