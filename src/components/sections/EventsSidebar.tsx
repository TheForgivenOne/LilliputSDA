import { Clock, MapPin } from "lucide-react";

interface ServiceTime {
  name: string;
  time: string;
}

interface EventsSidebarProps {
  services?: ServiceTime[];
}

const defaultServices: ServiceTime[] = [
  { name: "Sabbath School", time: "Saturdays at 9:30 AM" },
  { name: "Divine Service", time: "Saturdays at 11:00 AM" },
  { name: "AY Society", time: "Saturdays at 4:30 PM" },
  { name: "Prayer Meeting", time: "Wednesdays at 7:00 PM" },
];

export function EventsSidebar({ services = defaultServices }: EventsSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Regular Services */}
      <div className="bg-white dark:bg-stone-800 p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-4">
          Regular Services
        </h3>
        <div className="space-y-4">
          {services.map((service) => (
            <div key={service.name} className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-amber-700 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-stone-900 dark:text-stone-100">
                  {service.name}
                </p>
                <p className="text-sm text-stone-500 dark:text-stone-400">
                  {service.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Location */}
      <div className="bg-white dark:bg-stone-800 p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-4">
          Location
        </h3>
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-amber-700 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-stone-900 dark:text-stone-100">
              Lilliput SDA Church
            </p>
            <p className="text-sm text-stone-500 dark:text-stone-400">
              Lot 200-202, Lilliput
            </p>
            <p className="text-sm text-stone-500 dark:text-stone-400">
              Montego Bay, St. James, Jamaica
            </p>
          </div>
        </div>
        <div className="mt-4">
          <a
            href="https://maps.google.com/?q=Lilliput+SDA+Church+Montego+Bay+Jamaica"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-amber-700 dark:text-amber-400 font-medium text-sm hover:underline"
          >
            <MapPin className="w-4 h-4" />
            Get Directions
          </a>
        </div>
      </div>
    </div>
  );
}
