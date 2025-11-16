import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export interface AppPageHeaderBackBtnProps {
  href?: string;
}

export default function AppPageHeaderBackBtn({ href = './' }: AppPageHeaderBackBtnProps) {
  return (
    <Link href={href} title="Retornar a página anterior.">
      <ArrowLeft />
    </Link>
  );
}