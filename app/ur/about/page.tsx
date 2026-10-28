import SubPage from "@/app/[locale]/about/page";

export default async function Page() {
  return SubPage({ params: Promise.resolve({ locale: "ur" }) });
}
