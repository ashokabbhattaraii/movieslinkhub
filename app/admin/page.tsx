import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminDashboard from "./dashboard";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");

  if (!session?.value) {
    redirect("/login");
  }

  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    redirect("/login");
  }

  const decoded = Buffer.from(session.value, "base64").toString();
  if (!decoded.startsWith(`${secret}:`)) {
    redirect("/login");
  }

  return <AdminDashboard />;
}
