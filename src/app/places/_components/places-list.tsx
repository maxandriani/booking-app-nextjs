"use client";

import { Button } from "@/components/ui/button";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemSeparator, ItemTitle } from "@/components/ui/item";
import { Edit } from "lucide-react";
import Link from "next/link";
import { startTransition, useState, ViewTransition } from "react";
import useSWR from "swr";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import DeleteButton from "@/components/layout/delete-button";
import { deletePlaceById, Place, searchPlaces } from "@/services/places/places-service";

export function PlacesList() {
  const [activeItems, setActiveItems] = useState<Set<string>>(new Set());
  const searchParams = useSearchParams();
  const query = !!searchParams.get('search') ? { search: searchParams.get('search')! } : undefined;
  const { data: places, mutate } = useSWR(
    ['/places', query],
    () => searchPlaces(query),
    { suspense: true, fallbackData: [] }
  );

  async function handleDeletePlace(place: Place) {
    startTransition(() => setActiveItems(new Set(activeItems).add(place.id)));
    try {
      await deletePlaceById(place.id);
      await mutate();
      toast.success(`Local ${place.name} removido com sucesso!`)
    } catch (err) {
      toast.error(`Erro ao remover ${place.name}!`, { description: (err as Error).message });
    } finally {
      const newActiveItems = new Set(activeItems);
      newActiveItems.delete(place.id);
      startTransition(() => {
        setActiveItems(newActiveItems);
      });
    }
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <ItemGroup>
        {places.map((place) => (
          <ViewTransition name={`season-item-${place.id}`} key={`season-item-${place.id}`} enter="fade-in" update="blink" exit="move-out">
            <Item key={place.id} variant={activeItems.has(place.id) ? "muted" : "default"}>
              <ItemContent>
                <ItemTitle>{place.name}</ItemTitle>
                <ItemDescription>
                  <span className="flex w-full gap-6">
                    <span className="flex-1 min-w-0 w-fit">
                      <span className="font-medium">Endereço: </span>
                      <span>{place.address}</span>
                    </span>

                    <span className="flex-1 min-w-0 max-w-40">
                      <span className="font-medium">Created at: </span>
                      <span>{(new Date(place.created_at)).toLocaleDateString('pt-BR')}</span>
                    </span>
                  </span>
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button asChild variant="outline" disabled={activeItems.has(place.id)}>
                  <Link href={`/places/${place.id}`}>
                    <Edit />
                  </Link>
                </Button>
                <DeleteButton onClick={() => handleDeletePlace(place)} disabled={activeItems.has(place.id)} active={activeItems.has(place.id)} />
              </ItemActions>
            </Item>
            <ItemSeparator />
          </ViewTransition>
        ))}
      </ItemGroup>
    </div>
  );
}