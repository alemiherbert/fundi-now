# Fundi Now: Product & UI/UX Plan

**Fundi Now** connects drivers with on-demand mechanics. It's a mobile-first PWA with a WhatsApp channel, built with Next.js + shadcn/ui and developed in WSL (Ubuntu 24.04).

> **Purpose right now: a client demo.** The first build is a clickable, installable prototype with a simulated backend (see [Client demo](#client-demo-phase-1)).
> **Settled:** the market is **Uganda, starting in Kampala**. Payments are **MTN MoMo and Airtel Money** plus cash. Vehicles are **cars and boda bodas**. The brand colour is **blue** and the UI is **English for now**. After the demo, the backend is **Supabase**. See [§15](#15-decisions).

---

## 1. Product in one paragraph

A driver whose car won't start, has a flat, or needs a service opens Fundi Now, says what's wrong in two taps,
drops a pin, and sees a verified *fundi* (mechanic) heading their way with a live ETA and an upfront price range.
The fundi diagnoses on-site, sends an itemised quote the customer approves in-app before any work starts,
and the job is paid by mobile money (MTN or Airtel) or cash. Fundis get a steady stream of nearby jobs, fast payouts, and a reputation they own.

**One app (Fundi Now) plus an ops console, all from one codebase**

| Surface | Who | Form factor | Routes |
|---|---|---|---|
| **Fundi Now**, customer mode | Motorists, boda riders, fleet drivers | Phone, installable PWA | `/app` |
| **Fundi Now**, fundi mode | Verified fundis | The same installed app. The role set at sign-in decides the home screen | `/fundi` |
| **WhatsApp** | Anyone, no install needed | Chat | see [§9](#9-whatsapp-channel) |
| **Ops console** | Dispatch, support, verification | Desktop/tablet | `/admin` |

There's one install and one icon. After sign-in, the app opens in the right mode. Someone who is both a fundi and a car owner can switch modes in Account. Public marketing and landing pages live at `/`.

---

## 2. Users and what they need

| Persona | Context | What they need from the UI |
|---|---|---|
| **Stranded driver** | Roadside, stressed, maybe at night, low battery, patchy 3G | One big obvious action, minimal typing, trust signals, a live ETA, a way to share their location with someone |
| **Planner** | At home or office, wants a service or repair | Schedule a slot, compare prices, keep service history per vehicle |
| **Boda rider** | Earns by riding, so downtime costs income | Fastest possible request flow, cheap fixes, Luganda first |
| **Fundi** | Often on the move, using a mid-range Android phone with gloves or greasy hands | Large tap targets, loud job alerts, one-tap accept, simple quote builder, clear earnings |
| **Ops agent** | Desk | Live map, job queue, verification queue, dispute tools |

---

## 3. UX principles

1. **Design for the stressed state.** The breakdown path is the hero. It is reachable in one tap from launch and done in about 4 taps.
2. **Thumb-first layout.** Primary actions sit in the bottom third. Use bottom sheets (shadcn `Drawer`) rather than centred modals. Tap targets are at least 48px.
3. **No surprise prices.** Show the call-out fee and a price range before booking. Every extra cost needs explicit in-app approval.
4. **Trust is visible.** Show the fundi's photo, name, rating, jobs done, verified-ID badge and vehicle plate. A 4-digit **start PIN** confirms the right fundi arrived.
5. **Landmark-friendly location.** Kampala addresses are often landmark-based ("opposite the Shell, Ntinda"), so pair the map pin with a free-text "near…" note. The fundi can call the customer with one tap.
6. **Works on bad networks.** The app shell is cached, actions queue offline and replay on reconnect, there is an offline banner, maps load lazily, and SMS is the fallback for critical updates.
7. **English first, translation-ready.** The UI is English only for now. All UI text lives in one strings file, so Luganda or Swahili can be added later without hunting through components. Layouts should cope with strings 20–30% longer.
8. **Dark mode is first-class.** It helps at night and saves battery on OLED screens. The app follows the system setting and has a manual toggle.
9. **Every screen has four states:** loading (skeletons), empty, error and offline. Each one is designed, not left as an afterthought.

---

## 4. Core journeys

### 4.1 Customer: "Get help now"
```
Home ─▶ Pick problem ─▶ Confirm vehicle ─▶ Confirm location ─▶ Review price & pay method ─▶ Matching
                                                                                              │
 Rate & tip ◀─ Pay (mobile money / cash) ◀─ Work done ◀─ Approve quote ◀─ Fundi arrives (PIN) ◀─ Tracking
```
- Steps 2–4 are pre-filled whenever possible: last vehicle, GPS location. Most users just confirm.
- The problem step accepts an optional photo or voice note, which helps the fundi bring the right parts.
- If no fundi is found within about 2 minutes, offer to widen the radius, schedule for later, or call the support line.

### 4.2 Customer: "Book a service"
Home ─▶ Service type (oil change, full service, diagnostics, pre-purchase inspection) ─▶ Vehicle ─▶ Location ─▶ **Date & slot** (`Calendar`) ─▶ Fixed price ─▶ Confirmed ─▶ Reminder push and SMS ─▶ the same on-site flow as 4.1.

### 4.3 Fundi: onboarding (one-time)
Phone OTP ─▶ Personal details ─▶ Skills & vehicle types ─▶ Service area ─▶ Documents (National ID/NIN, trade certificates, police clearance certificate) ─▶ Selfie ─▶ Mobile money payout number (MTN or Airtel) ─▶ **"Under review"** state ─▶ Approved (push + SMS).

### 4.4 Fundi: job loop
Go **Online** ─▶ Job offer (full-screen, sound + vibration, 30s countdown) ─▶ Accept ─▶ Navigate (deep link to Google Maps) ─▶ Arrived ─▶ Enter customer PIN ─▶ Diagnose ─▶ **Build quote** (labour + parts) ─▶ Wait for approval ─▶ Work ─▶ Completion photos ─▶ Collect payment ─▶ Rate customer ─▶ Back online.

### 4.5 Job state machine (shared by all surfaces)
```
requested ─▶ matching ─▶ assigned ─▶ en_route ─▶ arrived ─▶ diagnosing ─▶ quote_pending ─▶ in_progress ─▶ completed ─▶ paid ─▶ reviewed
     │           │           │           │                                    │
     └───────────┴───────────┴───────────┴──▶ cancelled (by customer / fundi / ops, with reason)
                 └──▶ expired (no fundi found)                                └──▶ quote_declined ─▶ paid (call-out/diagnosis fee only)
```
Each transition writes a `job_events` row. That table drives the customer timeline, notifications and ops audit.

---

## 5. Information architecture

### Customer app (`/app`): bottom nav
**Home · Jobs · Garage · Account**. The "Get help" CTA lives on Home, not in the nav, so it can't be mis-tapped.

| Screen | Key shadcn pieces | Notes |
|---|---|---|
| Onboarding (3 cards) + language | `Carousel`, `Button`, `RadioGroup` | Skippable |
| Sign in: phone ▶ OTP | `Input`, `InputOTP`, `Field` | +256 default. The code goes to WhatsApp by default, with a "Send by SMS instead" link. Includes a WhatsApp-updates opt-in checkbox |
| Home | `Card`, `Button`, `Badge`, `Avatar` | Location chip, emergency CTA, problem grid, vehicle card, upcoming bookings |
| Request flow (steps 1–4) | `Drawer`, `Progress`, `ToggleGroup`, `Textarea`, `Command` | One step per drawer view, back gesture works |
| Matching | `Spinner`, custom radar animation, `Button` | Cancel is always available |
| Tracking | MapLibre map, `Drawer` (snap points), `Card`, `Avatar` | Status timeline, fundi card, Call / Chat / Share (native share sheet, so sending to WhatsApp is one tap), start PIN |
| Quote approval | `Drawer`, `Item`, `Separator`, `Button` | Itemised list. Approve / Ask / Decline |
| Payment | `Card`, `ToggleGroup`, `Spinner`, `Sonner` | MTN/Airtel preselected from the phone number (changeable). Then an "Approve UGX 500,000 on your phone" wait state, with a retry and help if the PIN prompt doesn't appear |
| Rate & tip | Star rating (custom), `ToggleGroup`, `Textarea` | Quick-tag compliments |
| Jobs list + detail/receipt | `Tabs`, `Item`, `Empty`, `Skeleton` | Active / Past tabs, downloadable receipt |
| Garage: vehicles + history | `Item`, `Dialog`/`Drawer`, `Command` (make/model search) | Plate, year, fuel, service reminders |
| Account | `Item`, `Switch`, `Select` | Profile, language, theme, WhatsApp updates on/off, switch to fundi mode (if approved), emergency contacts, help ("Chat with us on WhatsApp"), sign out |

### Fundi mode (`/fundi`): bottom nav
**Jobs · Earnings · Schedule · Profile**, with the **Online/Offline** `Switch` pinned in the header.

| Screen | Notes |
|---|---|
| Apply / onboarding wizard | Document upload with camera capture, progress saved per step |
| Home (online) | Today's earnings, demand hint ("busy near Ntinda"), current or next job card |
| Incoming offer (full-screen) | Countdown ring, distance, problem, vehicle, earnings range, Decline / **Accept**. If the push isn't acknowledged, the same offer arrives on WhatsApp with Accept/Decline buttons |
| Active job | Stepper: Navigate ▶ Arrived ▶ PIN ▶ Diagnose ▶ Quote ▶ Work ▶ Complete. Screen Wake Lock is on during the job |
| Quote builder | Labour presets + parts lines (`Field`, `InputGroup` with UGX prefix), live total, send |
| Earnings | Balance, payouts to mobile money, per-job breakdown incl. commission (commission on cash jobs is deducted from the next payout), weekly chart |
| Schedule | Booked service jobs, availability hours |
| Profile | Ratings, reviews, skills, documents, verification status |

### Ops console (`/admin`): desktop-first
shadcn `Sidebar` block layout: **Dashboard** (KPIs) · **Live dispatch map** · **Jobs** (TanStack data table) · **Fundi verification queue** · **Customers** · **Disputes & refunds** · **Pricing & categories**.

---

## 6. Key wireframes (mobile, ~360px)

**Customer Home**
```
┌────────────────────────────────┐
│ [pin] Ntinda, Kampala v [bell] │
│ Oli otya, Sarah                │
│ ┌────────────────────────────┐ │
│ │  BREAKDOWN? GET HELP NOW   │ │ ← brand blue, 64px, primary
│ │  Fundis nearby · ~15 min   │ │
│ └────────────────────────────┘ │
│ What's wrong?                  │
│ [Battery ] [Flat tyre] [Fuel ] │
│ [Lockout ] [Overheat ] [Won't  │
│ [Service ] [Diagnose ] [More..]│
│                                │
│ ┌ Toyota Premio · UBK 123A ──┐ │
│ │ Service due in ~800 km   > │ │
│ └────────────────────────────┘ │
├────────────────────────────────┤
│  Home    Jobs   Garage  Account│
└────────────────────────────────┘
```

**Tracking (bottom sheet over map)**
```
┌────────────────────────────────┐
│        [ live map: fundi→you ] │
│                                │
├──────────── ═══ ───────────────┤
│ Arriving in 8 min · 2.1 km     │
│ ● Assigned ● On the way ○ Here │
│ ┌────────────────────────────┐ │
│ │ (o) Kato M.  ★4.8  ✓ ID     │ │
│ │ Boda UFK 456B · 214 jobs   │ │
│ │ [ Call ] [ Chat ] [ Share ]│ │
│ └────────────────────────────┘ │
│ Start PIN   4  8  2  1         │
│ Give this to Kato on arrival   │
│            Cancel request      │
└────────────────────────────────┘
```

**Quote approval (drawer)**
```
│ Kato sent a quote              │
│ Battery replacement            │
│   N70 battery ....... 450,000  │
│   Labour ............. 30,000  │
│   Call-out (paid) .... 20,000  │
│   ──────────────────────────── │
│   Total           UGX 500,000  │
│ [   Approve & continue      ]  │
│ [ Ask a question ] [ Decline ] │
```

**Fundi incoming offer (full-screen)**
```
┌────────────────────────────────┐
│ NEW JOB                 ◔ 0:24 │
│ Flat tyre · Toyota Fielder     │
│ 1.8 km · ~6 min away           │
│ Jinja Rd, near Lugogo Mall     │
│ "Rear left, no spare"          │
│ Est. earning UGX 25,000–40,000 │
│                                │
│ [  Decline  ]  [   ACCEPT   ]  │ ← 56px, accept on the right (thumb)
└────────────────────────────────┘
```

---

## 7. Design system (shadcn/ui on Tailwind v4)

- **Base:** shadcn `new-york` style, `neutral` base colour, CSS variables in OKLCH. All brand changes happen in `globals.css` tokens, never inline colours.
- **Brand colour: "overall blue"**, a vivid cobalt that nods to mechanics' blue overalls.
  - Light mode: `--primary: oklch(0.55 0.20 260)` with white `--primary-foreground`.
  - Dark mode: lightened to about `oklch(0.70 0.16 255)` with dark text.
  - It stays clear of colours already owned by well-known brands in Kampala (MTN yellow, Airtel red, SafeBoda orange, Bolt green).
  - Alternatives: **teal** `oklch(0.62 0.13 195)` or **violet** `oklch(0.55 0.22 295)`. Every colour is a token in `globals.css`, so switching later is a one-file change.
  - **Green** marks success/paid and **red** marks destructive/cancel. Every colour pair is checked for WCAG AA contrast in both themes.
- **Type:** Geist Sans (Next.js default) or Inter. Base size 16px; status headlines (ETA, totals) use 24–32px with tabular numbers.
- **Radius & density:** `--radius: 0.75rem`, generous padding, at least 48px touch targets, 16px side gutters.
- **Icons:** `lucide-react` (ships with shadcn).
- **Motion:** subtle and purposeful (sheet snaps, status transitions, matching radar). Honour `prefers-reduced-motion`.

**Install these shadcn components first:**
`button card drawer sheet dialog input input-otp field input-group textarea select radio-group toggle-group switch badge avatar tabs separator skeleton spinner empty item progress sonner command calendar carousel scroll-area sidebar`

**Custom components to build** (in `components/shared`, all composed from shadcn primitives):
`BottomNav` · `EmergencyCTA` · `ProblemGrid` · `LocationPicker` (map pin + landmark note) · `MapView` (lazy MapLibre) · `StatusTimeline` · `FundiCard` · `StartPin` · `PriceBreakdown` · `QuoteBuilder` · `JobOfferCard` (countdown ring) · `OnlineToggle` · `StarRating` · `OfflineBanner` · `InstallPrompt` · `MpesaWaitState`

---

## 8. PWA: yes, and here's why

**Why PWA fits:** the market is Android-heavy, many phones are short on storage, and installs cost data. App stores add friction and review delays. A link shared on WhatsApp opens the app instantly, and the same codebase serves both apps.

| Capability | Approach |
|---|---|
| Installable | `app/manifest.ts` (Next.js built-in). One manifest: name **Fundi Now**, `start_url: /`. After sign-in, the app routes to customer or fundi mode |
| Offline shell & caching | Service worker via **Serwist** (precache shell, runtime-cache API/map tiles). Fallback: a hand-written `sw.js` following the official Next.js PWA guide. Check Turbopack compatibility at scaffold time |
| Offline actions | Queue status updates and quote approvals in IndexedDB and replay on reconnect (Background Sync where supported) |
| Push notifications | Web Push (VAPID): job offers, fundi arriving, quote received, payment confirmed. **iOS caveat:** push works only after the PWA is added to the Home Screen (iOS 16.4+), so prompt for install first. WhatsApp, then SMS, is the fallback for critical events (§9) |
| Location | Geolocation API, foreground only |
| Install prompt UX | Custom `InstallPrompt` drawer shown after the first successful job (not on first visit). iOS gets a "Share ▶ Add to Home Screen" coach mark |

**Known PWA limitation:** browsers won't track location in the background once the screen is off. Mitigations:
1. Screen **Wake Lock** stays on during active jobs.
2. The fundi sends position updates only while en route.
3. **If the pilot shows this isn't enough, wrap the app with Capacitor** (or a Trusted Web Activity on Android) and turn on native background location in fundi mode only. The web code stays the same.

**Performance budget** (low-end Android on 3G): initial JS under ~200 KB for `/app`. Maps are lazy-loaded behind a static thumbnail. Images are AVIF/WebP. LCP under 2.5s. Server Components by default.

---

## 9. WhatsApp channel

**Why:** most customers and fundis already use WhatsApp every day. It reaches people who haven't installed the app, and it works where web push doesn't (iPhones that haven't added the app to the Home Screen). A message from a verified "Fundi Now" business profile also builds trust.

### Three levels, adopted in order

| Level | What it does | Needs the API? | Phase |
|---|---|---|---|
| **1. Click-to-chat & share** | "Chat with us on WhatsApp" (`wa.me/256…`) on the landing page and Help screen. The live-tracking link is shared through the phone's share sheet | No, free | 1 |
| **2. Notifications & OTP** | Login codes. Booking confirmed, fundi on the way (with tracking link), quote ready (link to approve), payment receipt, service reminders. **Backup job offers to fundis** with Accept/Decline buttons | Yes | 3 |
| **3. Book entirely in chat** | Customer sends "Hi" ▶ picks the problem from a list ▶ shares a **location pin** (native in WhatsApp) ▶ picks a vehicle ▶ the mobile money PIN prompt (MTN or Airtel) pops up on their phone ▶ gets a tracking link. **WhatsApp Flows** (in-chat forms) handle vehicle and time-slot entry. A human agent can take over when needed | Yes | 5 |

Level 3 lets someone book, pay and track **without installing anything**. That could be a strong way to win customers, but it's the most work, so it comes after the pilot proves the core service.

### How it fits the architecture
```
Meta Cloud API ──webhook──▶ /api/whatsapp/webhook   (verify X-Hub-Signature-256)
                               │ inbound text, button replies, location pins, delivery receipts
                               ▼
                    wa_conversations (bot state) ──▶ same job services the PWA uses

job_events ──▶ notifications (outbox) ──▶ dispatcher ──▶ Web Push │ WhatsApp template │ SMS
```
- **Channel routing:** one notifications outbox picks the channel from the user's preference and what's available, in the order **push ▶ WhatsApp ▶ SMS**. For example, a fundi job offer goes to WhatsApp if the app doesn't acknowledge the push within about 10 seconds.
- **The bot is a thin layer.** It calls the same server functions as the app, so pricing, matching and job rules live in one place.

### Rules and costs to plan around
- **Templates:** any message Fundi Now starts (notifications, OTP) must use a template Meta has approved in advance. Free-form replies are allowed only within 24 hours of the customer's last message.
- **Pricing:** Meta charges per delivered template message. The rate depends on the category (marketing costs most; utility and authentication cost less) and the country. Utility templates sent while the customer's 24-hour window is open are free, and so are replies. Check Meta's current rate card for Uganda before modelling costs.
- **Opt-in:** customers must agree to receive WhatsApp messages. A clear checkbox at sign-in is enough. Store `wa_opt_in_at` and honour STOP.
- **Lead time:** setup takes days to weeks. It covers Meta Business verification, approval of the "Fundi Now" display name, a dedicated phone number and template approvals. Start in Phase 0.
- **AI bots:** Meta's Business terms (in force since January 2026) bar general-purpose AI assistants from the API. A booking and support bot for Fundi Now's own service is allowed.

### Provider options
| Option | Good | Watch out for |
|---|---|---|
| **Meta Cloud API, direct** (recommended) | No reseller markup. New features such as Flows arrive here first. Meta hosts it | We build template management, webhooks and the support inbox ourselves. Billed in USD |
| **Africa's Talking** | Same vendor and bill as SMS, local support and billing | Markup. Confirm Flows support and feature parity |
| **Twilio** | Excellent docs. Verify sends OTP over WhatsApp or SMS in one call. Supabase phone login supports Twilio out of the box | Markup on top of Meta's fees, USD |
| 360dialog, Infobip, Gupshup | Low-markup or enterprise resellers | One more vendor to manage |

Later, a shared inbox such as Chatwoot (open source) can let ops agents take over conversations from the bot.

---

## 10. Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js (App Router, latest) + TypeScript + React 19** | SSR/RSC, built-in manifest, one deploy for three surfaces |
| UI | **Tailwind v4 + shadcn/ui** | As requested. Accessible Radix primitives, we own the code |
| Forms & validation | react-hook-form + **zod** (schemas shared client and server) | |
| Backend | **Supabase**: Postgres + **PostGIS** (nearest-fundi queries), Auth (phone OTP), **Realtime** (live tracking/status), Storage (photos, KYC docs), Row Level Security | Fastest path to a real-time, location-aware MVP |
| OTP & SMS | Supabase's Send-SMS auth hook sends the code on **WhatsApp** first, with SMS via **Africa's Talking** as the fallback | Local delivery rates and reliability |
| WhatsApp | **Meta WhatsApp Cloud API** (direct) | Notifications, OTP, backup fundi offers, and booking later. See §9 |
| Payments | **Mobile money (MTN MoMo + Airtel Money)** through one aggregator to start: collections (the customer pays) and disbursements (fundi payouts), plus cash. See *Mobile money* below | Both networks from one integration. Merchant onboarding takes time, so start early |
| Maps | **MapLibre GL JS** + OSM-based tiles (MapTiler/Protomaps). Google Maps deep links for fundi navigation | Much cheaper than Google Maps JS at scale |
| i18n | English only for now, with strings kept in one file. Add **next-intl** when a second language is needed | |
| State / data | Server Actions + TanStack Query on the client for realtime-heavy screens | |
| Testing | Vitest (unit), **Playwright** with mobile device emulation (e2e), Lighthouse CI (PWA/perf) | |
| Hosting | Vercel (app) + Supabase Cloud. Pick the region closest to East Africa | |

### Mobile money (Uganda)

Customers pay with **MTN Mobile Money** or **Airtel Money**:
1. The app sends a *request to pay*.
2. The customer gets a prompt on their phone and enters their PIN.
3. The provider calls our webhook, and the job is marked paid.

Fundis are paid out to their own mobile money number.

| Option | Good | Watch out for |
|---|---|---|
| **Aggregator** (recommended to start), e.g. Flutterwave, Pesapal, Yo! Payments, DPO Pay | One integration covers MTN, Airtel and cards. The aggregator handles merchant onboarding with both networks | A fee on top of network charges. Confirm each one supports **payouts** to mobile money in Uganda, then compare fees and settlement times |
| **Direct**: MTN MoMo API and Airtel Money API | Lowest fees. Both offer collections and disbursements, with sandboxes | Two integrations, two merchant agreements and longer approval |

- **Swappable provider:** all payment code sits behind a `PaymentProvider` interface (`requestPayment`, `checkStatus`, `payout`, `handleWebhook`). We can start with an aggregator and add direct MTN/Airtel later without touching app code.
- **Network detection:** the network is preselected from the phone number, and the user can change it.
- **Waiting for payment:** the app also polls the status in case the webhook is late, then times out after about 2 minutes with a retry.
- **Money format:** amounts are stored as whole shillings (no cents in practice) and shown as "UGX 500,000".
- **Cash:** the fundi confirms the cash was received. The platform commission is recorded against their balance and deducted from their next mobile money payout.

### Data model (first cut)
```
profiles        id, roles[](customer|fundi|admin), name, phone, lang, avatar_url, wa_opt_in_at
vehicles        id, owner_id, type(car|boda|truck), make, model, year, plate, fuel
fundis          profile_id, status(pending|approved|suspended), skills[], vehicle_types[],
                service_radius_km, is_online, last_location geography(Point), rating, jobs_count
fundi_documents fundi_id, kind, file_path, verified_at
service_types   id, slug, name_en, name_sw, category(roadside|repair|service), callout_fee, price_min, price_max
jobs            id, customer_id, fundi_id, vehicle_id, service_type_id, status, location geography(Point),
                landmark, notes, media[], scheduled_for, start_pin, created_at
job_events      id, job_id, from_status, to_status, actor_id, meta jsonb, created_at
quotes          id, job_id, status(pending|approved|declined), total
quote_items     id, quote_id, kind(labour|part|fee), label, qty, unit_price
payments        id, job_id, method(mtn_momo|airtel_money|cash), amount_ugx, payer_phone, provider, provider_ref, status
payouts         id, fundi_id, amount_ugx, network(mtn|airtel), phone, provider, provider_ref, status
fundi_ledger    id, fundi_id, job_id, kind(earning|commission|payout|adjustment), amount_ugx   -- cash-job commission
reviews         id, job_id, from_id, to_id, stars, tags[], comment
notifications   id, user_id, job_id, kind, channel(push|whatsapp|sms), status, provider_ref, sent_at, delivered_at
wa_conversations id, phone, profile_id, state, context jsonb, last_inbound_at   -- tracks the 24h window
```

### Matching (MVP)
1. On request, query approved, online fundis with the matching skill and vehicle type within radius, ordered by `ST_Distance`.
2. Offer to the nearest fundi for 30s, then cascade to the next. Later, test a broadcast to the top 3 where first to accept wins.
3. Expand the radius once. If there's still no match, mark the job `expired` and present the fallback options.
4. Run this in a Postgres function plus an Edge Function. All clients receive changes through Realtime channels per job.

---

## 11. Repo layout

```
fundi-now/
├─ src/
│  ├─ app/
│  │  ├─ (marketing)/page.tsx
│  │  ├─ (auth)/login, verify
│  │  ├─ app/            # customer: home, request/, jobs/[id], garage/, account/
│  │  ├─ fundi/          # fundi mode: home, offer/[id], jobs/[id], earnings/, schedule/, profile/
│  │  ├─ admin/          # ops console
│  │  ├─ api/            # webhooks: payments/webhook, whatsapp/webhook, push
│  │  ├─ manifest.ts
│  │  └─ sw.ts           # service worker (Serwist)
│  ├─ components/ui/     # shadcn (generated, owned)
│  ├─ components/{shared,customer,fundi,admin}/
│  ├─ lib/{supabase,payments,whatsapp,notify,geo,push,i18n,validators}/
│  └─ lib/strings.ts     # all UI text (English for now)
├─ supabase/{migrations,functions,seed.sql}
├─ public/icons/         # maskable PWA icons
└─ tests/e2e/
```

---

## 12. WSL development setup

**Keep the code in the Linux filesystem (`~/projects/fundi-now`), not `/mnt/d/...`.** On the Windows drive, `pnpm install` is several times slower and Next.js file-watching (hot reload) is unreliable. Open it from Windows with VS Code using the **WSL extension** (`code .` inside Ubuntu).

**Toolchain: installed and managed by Volta** (`~/.volta`):

| Tool | Version | Notes |
|---|---|---|
| Node | **26.13.1** (latest LTS) | Installed with `volta install node`. Volta's version takes precedence over Ubuntu's old system Node 18 |
| pnpm | **10.34.9** | Installed with `volta install pnpm@10`. pnpm 12 won't run under Volta: it now ships as a native binary that Volta doesn't recognise |

> **Note:** Volta's README now says the project is **unmaintained** and recommends `mise` instead. It works today, so there's no rush. If it breaks after an OS or Node update, switching to `mise` is a small change because the versions are pinned in `package.json`.

```bash
# inside Ubuntu (WSL); Node and pnpm are already installed
mkdir -p ~/projects && cd ~/projects
pnpm create next-app@latest fundi-now --ts --tailwind --eslint --app --src-dir --import-alias "@/*"
cd fundi-now && git init
volta pin node@26          # records the Node version in package.json for anyone else working on it
pnpm dlx shadcn@latest init
pnpm dlx shadcn@latest add button card drawer sheet dialog input input-otp field input-group \
  textarea select radio-group toggle-group switch badge avatar tabs separator skeleton spinner \
  empty item progress sonner command calendar carousel scroll-area sidebar
code .
```

Other setup:
- **Supabase local stack** needs Docker. Use Docker Desktop with WSL integration enabled for Ubuntu, then `pnpm dlx supabase init && pnpm dlx supabase start`.
- **Testing on a real phone:** service workers, geolocation and push all need **HTTPS** off localhost. Run `cloudflared tunnel --url http://localhost:3000` to get a public HTTPS URL. Mobile money and WhatsApp webhooks need the same URL.
- **Optional:** set `networkingMode=mirrored` under `[wsl2]` in `%UserProfile%\.wslconfig` so the phone can reach WSL directly over Wi-Fi.
- **Chrome DevTools** device mode plus the Lighthouse PWA audit for quick checks.

---

## 13. Build phases

| Phase | Goal | Output | Exit check |
|---|---|---|---|
| **0. Foundation** | Environment and skeleton | WSL toolchain ✓ (Volta, Node 26, pnpm 10), repo, Next + shadcn + tokens, lint/format, CI, deploy preview. **Start Meta Business verification and get a WhatsApp number now**, because approval takes time | Blank app installs as a PWA on a phone |
| **1. Client demo** ← *now* | Show the client the full experience | See [Client demo](#client-demo-phase-1) below | The client can run the whole journey on their own phone |
| **2. Core platform** | Real end-to-end job | Supabase schema + RLS, phone OTP, request ▶ match ▶ track (Realtime), quotes, reviews | Two phones run a full job on staging |
| **3. Money & messaging** | Get paid, stay informed | Mobile money collections and payouts (MTN + Airtel), cash flow and fundi ledger, Web Push, **WhatsApp notifications, OTP and backup fundi offers**, SMS fallback, receipts | Real UGX transactions in the sandbox, then live |
| **4. Ops & pilot** | Run it for real | Ops console, fundi verification, disputes/refunds, analytics. Pilot in 1–2 Kampala areas with about 20 vetted fundis | Pilot KPIs: time-to-match, ETA accuracy, completion rate, rating |
| **5. WhatsApp booking** | Book with no install | WhatsApp bot with Flows, location pins, mobile money prompt, human handover | A customer can book, pay and track without installing anything |
| **Later** | Grow | Capacitor wrap if needed, fleet/corporate accounts, parts supply, subscriptions/roadside cover, insurer partnerships | |

### Client demo (Phase 1)
There's no backend in the demo. Everything runs in the browser with realistic simulated data, so it's quick to build and can't fail in front of the client.

**Real:** every customer and fundi screen in §5, installable as a PWA, light and dark mode, deployed to a shareable URL.

**Simulated:**
- **Sign-in:** any +256 number works, and the code is shown on screen.
- **Location:** a fixed Kampala spot (Ntinda), with an option to use real GPS.
- **Matching:** a short "finding a fundi" wait, then a fundi is assigned.
- **Tracking:** the fundi's marker moves along a real Kampala route. The map uses MapLibre with free OpenFreeMap tiles, so no API key is needed.
- **Quote:** arrives after the fundi has arrived and diagnosed the problem.
- **Payment:** choosing **MTN MoMo** or **Airtel Money** shows a simulated phone PIN prompt, then success and a receipt. Networks appear as labelled colour chips, not official logos.
- **WhatsApp:** a click-to-chat link only, plus mock previews of the messages the live version would send.

**Presenter view (`/demo`):** two phone frames side by side on a laptop, customer on the left and fundi on the right, kept in sync. When the fundi accepts the job, the customer's screen updates live. This works well for a screen-share or meeting room.

**Demo controls:** a small hidden panel to skip ahead through job steps, switch modes and reset.

**Not included:** keeping two separate phones in sync would need a small realtime backend. Supabase Realtime makes that an easy add-on if the client wants it.

---

## 14. Safety, trust and quality checklist
- [ ] Fundi KYC: National ID (NIN), police clearance certificate, selfie match, manual approval
- [ ] Start PIN before work begins, plus a live trip share link for customers
- [ ] SOS / emergency contact button during active jobs
- [ ] In-app quote approval required for any charge beyond the call-out fee
- [ ] Ratings both ways, with low-rating review by ops
- [ ] Masked phone numbers (later, via Africa's Talking voice)
- [ ] WhatsApp: opt-in recorded, STOP honoured. Messages never contain KYC data or exact addresses; they link into the signed-in app instead
- [ ] Data protection: comply with Uganda's Data Protection and Privacy Act 2019, including registering with the Personal Data Protection Office (PDPO). KYC documents go in private storage buckets with signed URLs only
- [ ] Payments regulation: holding customer money before paying fundis may need Bank of Uganda licensing under the National Payment Systems Act. Using a licensed aggregator and settling quickly avoids most of this. Get local legal advice before launch
- [ ] Tax: check whether URA's EFRIS e-receipting applies once the business is VAT-registered
- [ ] Accessibility: AA contrast, 48px targets, labelled icons, works at 200% font size, reduced motion

---

## 15. Decisions

**Settled**
- Purpose: **client demo first**, a clickable prototype with a simulated backend
- Name: **Fundi Now**, one app with customer and fundi modes
- Market: **Uganda**, launching in **Kampala**. Currency UGX, phone numbers +256
- Payments: **MTN MoMo and Airtel Money**, plus cash. The demo simulates them. Whether to integrate the networks directly or through an aggregator is decided when going live
- Vehicles: **cars and boda bodas**
- Brand colour: **overall blue**
- Language: **English** for now
- Business model: **commission per job, 15–20%**
- Backend after the demo: **Supabase**
- Dev toolchain: WSL + Volta (Node 26) + pnpm

**Open, but not needed for the demo**
1. **WhatsApp:** there's no Meta Business account yet. Set one up when moving past the demo, because verification takes days to weeks. The demo uses click-to-chat only.
2. **Native wrap:** PWA first, with a native wrap only if the pilot proves it necessary.
3. **Demo hosting:** Vercel (needs an account) or another host for the shareable URL.
