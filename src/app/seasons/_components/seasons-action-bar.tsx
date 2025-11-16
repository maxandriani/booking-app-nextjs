"use client";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Card, CardContent } from "@/components/ui/card";
import { FilterIcon, PlusCircleIcon, RefreshCcwIcon } from "lucide-react";
import Link from "next/link";
import { useState, ViewTransition } from "react";
import SeasonsFilter from "./seasons-filter";
import { useRouter, useSearchParams } from "next/navigation";

export default function SeasonsActionBar() {
  const searchParams = useSearchParams();
  const [showSearchBar, setShowSearchBar] = useState(false);
  const router = useRouter();

  return (
    <>
      <ButtonGroup>
        <ButtonGroup>
          <Button asChild>
            <Link href="./seasons/new">
              <PlusCircleIcon />
              <span>Novo</span>
            </Link>
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button variant="secondary" onClick={() => setShowSearchBar(!showSearchBar)}>
            <FilterIcon />
            <span>Pesquisar</span>
          </Button>
          <Button title="Atualizar registros" variant="secondary" onClick={() => router.refresh()}>
            <RefreshCcwIcon />
          </Button>
        </ButtonGroup>
      </ButtonGroup>
      <ViewTransition enter="slide-in">
        {!!showSearchBar && (
          <Card className="p-3">
            <CardContent className="p-0">
              <SeasonsFilter search={searchParams.get("search")?.toString()} />
            </CardContent>
          </Card>)}
      </ViewTransition>
    </>
  )
}