import { redirect } from "next/navigation";

// La création se fait maintenant depuis le dashboard admin
export default function CreatePage() {
  redirect("/admin");
}
