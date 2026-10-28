import SubPage from "@/app/[locale]/contact/page";

export default async function Page() {
  return SubPage({ params: Promise.resolve({ locale: "ur" }) });
}
