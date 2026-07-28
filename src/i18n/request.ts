import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";
import { defaultLocale, LOCALE_COOKIE, locales, type Locale } from "./config";

function pickLocale(
  cookieValue: string | undefined,
  acceptLanguage: string | undefined,
): Locale {
  const supported = locales as readonly string[];

  if (cookieValue && supported.includes(cookieValue)) {
    return cookieValue as Locale;
  }

  const fromHeader = acceptLanguage
    ?.split(",")
    .map((part) => part.trim().split(";")[0].trim().split("-")[0].trim())
    .find((lang): lang is Locale => supported.includes(lang));

  return fromHeader ?? defaultLocale;
}

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const headersList = await headers();

  const locale = pickLocale(
    cookieStore.get(LOCALE_COOKIE)?.value,
    headersList.get("accept-language") ?? undefined,
  );

  const messages =
    locale === "es"
      ? (await import("../../messages/es.json")).default
      : (await import("../../messages/en.json")).default;

  return { locale, messages };
});
