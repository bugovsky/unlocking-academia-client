import { createFileRoute } from "@tanstack/react-router";
import { Consultation } from "../pages/Request";

export const Route = createFileRoute("/consultation")({
  component: Consultation,
});