"use server";

import { cookies } from "next/headers";
import { LOCALE_COOKIE, locales, type Locale } from "@/i18n/config";

export async function setLocale(locale: string): Promise<void> {
  const supported = locales as readonly string[];
  if (!supported.includes(locale)) return;
  const cookieStore = await cookies();
  cookieStore.set(LOCALE_COOKIE, locale as Locale, { path: "/" });
}
