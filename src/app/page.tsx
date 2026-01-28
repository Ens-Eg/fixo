import { redirect } from "next/navigation";
import { routing } from "@/i18n/routing";

export default function RootPage() {
  // Server-side redirect to default locale (no refresh)
  redirect(`/${routing.defaultLocale}/`);
}
