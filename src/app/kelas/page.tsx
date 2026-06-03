import { redirect } from "next/navigation";

// Detail kelas kini di /kelas/[slug]. Tanpa slug, arahkan ke katalog.
export default function KelasIndex() {
  redirect("/katalog");
}
