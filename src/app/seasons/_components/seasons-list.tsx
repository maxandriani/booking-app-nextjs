"use client";

import { Button } from "@/components/ui/button";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemSeparator, ItemTitle } from "@/components/ui/item";
import { Edit } from "lucide-react";
import Link from "next/link";
import { startTransition, useState, ViewTransition } from "react";
import { deleteSeasonById, searchSeasons, Season } from "@/services/seasons/season-service";
import useSWR from "swr";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import DeleteButton from "@/components/layout/delete-button";

export function SeasonsList() {
  const [activeItems, setActiveItems] = useState<Set<string>>(new Set());
  const searchParams = useSearchParams();
  const query = !!searchParams.get('search') ? { search: searchParams.get('search')! } : undefined;
  const { data: seasons, mutate } = useSWR(
    ['/seasons', query],
    () => searchSeasons(query),
    { suspense: true, fallbackData: [] }
  );

  async function handleDeleteSeason(season: Season) {
    startTransition(() => setActiveItems(new Set(activeItems).add(season.id)));
    try {
      await deleteSeasonById(season.id);
      await mutate();
      toast.success(`Temporada ${season.name} removida com sucesso!`)
    } catch (err) {
      toast.error(`Erro ao remover ${season.name}!`, { description: (err as Error).message });
    } finally {
      const newActiveItems = new Set(activeItems);
      newActiveItems.delete(season.id);
      startTransition(() => {
        setActiveItems(newActiveItems);
      });
    }
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <ItemGroup>
        {seasons.map((season) => (
          <ViewTransition name={`season-item-${season.id}`} key={`season-item-${season.id}`} enter="fade-in" update="blink" exit="move-out">
            <Item key={season.id} variant={activeItems.has(season.id) ? "muted" : "default"}>
              <ItemContent>
                <ItemTitle>{season.name}</ItemTitle>
                <ItemDescription>
                  <span className="flex w-full gap-6">
                    <span className="flex-1 min-w-0 max-w-40">
                      <span className="font-medium">Created at: </span>
                      <span>{(new Date(season.created_at)).toLocaleDateString('pt-BR')}</span>
                    </span>

                    <span className="flex-1 min-w-0 max-w-40">
                      <span className="font-medium">Faturado: </span>
                      <span>R$ 90.000,50</span>
                    </span>

                    <span className="flex-1 min-w-0 max-w-40">
                      <span className="font-medium">Saldo: </span>
                      <span>20.000,00</span>
                    </span>
                  </span>
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button asChild variant="outline" disabled={activeItems.has(season.id)}>
                  <Link href={`/seasons/${season.id}`}>
                    <Edit />
                  </Link>
                </Button>
                <DeleteButton onClick={() => handleDeleteSeason(season)} disabled={activeItems.has(season.id)} active={activeItems.has(season.id)} />
              </ItemActions>
            </Item>
            <ItemSeparator />
          </ViewTransition>
        ))}
      </ItemGroup>
    </div>
  );
}