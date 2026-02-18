import TicketDetailClient from "./TicketDetailClient";

export function generateStaticParams() {
  return [{ id: "_" }];
}

export default function TicketDetailPage() {
  return <TicketDetailClient />;
}
