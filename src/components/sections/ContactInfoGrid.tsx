import { MapPin, Mail, Clock } from "lucide-react";
import { ContactInfoCard } from "@/components/ui/ContactInfoCard";

const contactInfo = [
  {
    icon: MapPin,
    title: "Address",
    content: (
      <>
        Lot 200-202, Lilliput
        <br />
        Montego Bay, St. James
        <br />
        Jamaica
      </>
    ),
  },
  {
    icon: Mail,
    title: "Email",
    content: (
      <a 
        href="mailto:lhamilton@westjamaica.org" 
        className="hover:text-amber-700 dark:hover:text-amber-400"
      >
        lhamilton@westjamaica.org
      </a>
    ),
  },
  {
    icon: Clock,
    title: "Office Hours",
    content: (
      <>
        By Appointment
        <br />
        <span className="text-xs text-stone-400">
          Contact us to schedule a visit
        </span>
      </>
    ),
  },
];

export function ContactInfoGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {contactInfo.map((info) => (
        <ContactInfoCard key={info.title} icon={info.icon} title={info.title}>
          {info.content}
        </ContactInfoCard>
      ))}
    </div>
  );
}
