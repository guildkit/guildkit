import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ cookies }) => {
  const token = cookies.get("token");

  if (!token) {
    return redirect(303, "/auth");
  }
};
