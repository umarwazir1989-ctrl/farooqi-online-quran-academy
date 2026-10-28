import SubPage from "@/app/[locale]/courses/page";

export default async function Page() {
  return SubPage({ params: Promise.resolve({ locale: "ur" }) });
}
