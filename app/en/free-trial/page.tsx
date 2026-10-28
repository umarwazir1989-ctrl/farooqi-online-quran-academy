import SubPage from "@/app/[locale]/free-trial/page";

export default async function Page() {
  return SubPage({ params: Promise.resolve({ locale: "en" }) });
}
