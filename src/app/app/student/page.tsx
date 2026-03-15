import { redirect } from "next/navigation";

export default function StudentRootPage() {
  redirect("/app/student/home");
}