import { TicketPurchaseFlow } from "@/components/ticket-purchase-flow"

export default function EventPage({ params }: { params: { id: string } }) {
  return <TicketPurchaseFlow eventId={params.id} />
}
