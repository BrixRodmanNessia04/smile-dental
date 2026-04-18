import { redirect } from "next/navigation";

import { AUTH_ROUTES } from "@/lib/constants/routes";

export default function Page() {
  redirect(AUTH_ROUTES.ADMIN_DASHBOARD);
}
