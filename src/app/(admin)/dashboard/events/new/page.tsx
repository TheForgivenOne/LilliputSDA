import { EventForm } from "@/components/admin/events/EventForm";
import { FormPageLayout } from "@/components/admin/FormPageLayout";

export default function NewEventPage() {
  return (
    <FormPageLayout
      title="Create Event"
      description="Add a new event to the church calendar"
      breadcrumbs={[{ label: "Events", href: "/dashboard/events" }]}
    >
      <EventForm />
    </FormPageLayout>
  );
}
