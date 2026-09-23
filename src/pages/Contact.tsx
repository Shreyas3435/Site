import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { ContactSection } from "@/components/sections/Contact";

export default function Contact() {
  useDocumentTitle("Contact");
  return <ContactSection asPage />;
}
