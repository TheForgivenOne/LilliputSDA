import { EventForm } from "@/components/admin/events/EventForm";

export default function NewEventPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100 mb-2">
        Create Event
      </h1>
      <p className="text-stone-600 dark:text-stone-400 mb-8">
        Add a new event to the church calendar
      </p>
      <div className="bg-white dark:bg-stone-800 rounded-xl p-6 border border-stone-200 dark:border-stone-700">
        <EventForm />
      </div>
    </div>
  );
}
