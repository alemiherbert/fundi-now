const nf = new Intl.NumberFormat("en-US");

/** Uganda shillings are shown as whole numbers: "UGX 500,000". */
export const ugx = (n: number) => `UGX ${nf.format(Math.round(n))}`;
export const num = (n: number) => nf.format(Math.round(n));

const dateFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" });
const timeFmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit" });

export const formatDate = (ts: number) => dateFmt.format(ts);
export const formatTime = (ts: number) => timeFmt.format(ts);

/** Detect the mobile money network from a Ugandan number (9 national digits). */
export function detectNetwork(phone: string): "mtn" | "airtel" | null {
  const d = phone.replace(/\D/g, "").replace(/^256/, "").replace(/^0/, "");
  if (/^7[678]/.test(d)) return "mtn";
  if (/^7[045]/.test(d)) return "airtel";
  return null;
}
