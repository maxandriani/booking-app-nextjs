import { CheckCircleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

export interface AppAlertErrorProps {
  title?: string;
  description?: string;
}

export default function AppAlertError({ title, description }: AppAlertErrorProps) {
  return (
    <Alert variant="destructive">
      <CheckCircleIcon />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  )
}