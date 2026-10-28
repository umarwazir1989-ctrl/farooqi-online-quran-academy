import SubPage from "@/app/[locale]/teachers/page";

export default async function Page() {
  return SubPage({ params: Promise.resolve({ locale: "en" }) });
}
