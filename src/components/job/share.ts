import { toast } from "sonner";

/** Native share sheet (WhatsApp is one tap away on phones), clipboard fallback. */
export async function shareTrip(ref: string) {
  const url = `${window.location.origin}/app/job`;
  const data = { title: "Fundi Now", text: `Track my mechanic live on Fundi Now (${ref})`, url };
  try {
    if (navigator.share) {
      await navigator.share(data);
      return;
    }
    await navigator.clipboard.writeText(`${data.text}: ${url}`);
    toast.success("Tracking link copied");
  } catch {
    // user closed the share sheet
  }
}
