import { MapPin, Phone, Mail, Clock } from "lucide-react";
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
    icon: Phone,
    title: "Phone",
    content: (
      <>
        <a href="tel:+18761234567" className="hover:text-amber-700 dark:hover:text-amber-400">
          (876) 123-4567
        </a>
        <br />
        <span className="text-xs text-stone-400">
          Mon-Fri, 9:00 AM - 4:00 PM
        </span>
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
        Monday - Friday
        <br />
        9:00 AM - 4:00 PM
      </>
    ),
  },
];

export function ContactInfoGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {contactInfo.map((info) => (
        <ContactInfoCard key={info.title} icon={info.icon} title={info.title}>
          {info.content}
        </ContactInfoCard>
      ))}
    </div>
  );
}
