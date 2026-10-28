import SubPage from "@/app/[locale]/fees/page";

export default async function Page() {
  return SubPage({ params: Promise.resolve({ locale: "ur" }) });
}
