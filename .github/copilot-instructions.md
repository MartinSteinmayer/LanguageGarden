# Project Overview

I am currently in a 2-day Hackathon (so dont worry about testing or anything, build fast and break things), this is our idea. 

3D globe shows language dots:

- **Green** → Voice Available
- **Yellow/Red** → Endangered/Severely Endangered

---

## Tech Stack

- **Frontend**: Next.js (App Router), TypeScript, Tailwind, shadcn/ui
- **Map**: **Mapbox GL JS** (globe projection, fog/atmosphere) [Mapbox Docs](https://docs.mapbox.com/mapbox-gl-js/guides/globe/?utm_source=chatgpt.com)
- **Payments**: Stripe (Checkout or Payment Links for donations) [Stripe Docs](https://docs.stripe.com/payment-links?utm_source=chatgpt.com)
- **Voice/TTS**: ElevenLabs (server-side proxy)

---

## Mapbox Setup (Next.js)

**Rules Copilot should follow:**

1. **Client-only map**: Mapbox GL JS must render on the client (no SSR for the map canvas). Use a Client Component and initialize **inside `useEffect`**. (Dynamic import/`ssr:false` is also acceptable.)  
   [Medium Guide](https://medium.com/%40timothyde/making-next-js-and-mapbox-gl-js-get-along-a99608667e67?utm_source=chatgpt.com)

3. **GeoJSON source + circle layer** for dots; use **expressions** for color by status.  
   [Mapbox Layers Guide](https://docs.mapbox.com/mapbox-gl-js/guides/styles/work-with-layers/?utm_source=chatgpt.com)

4. **Click handling**: use `map.on('click', layerId, ...)` and/or `queryRenderedFeatures` to open `/l/[iso6393]`.  
   [Mapbox Query Features Example](https://docs.mapbox.com/mapbox-gl-js/example/queryrenderedfeatures/?utm_source=chatgpt.com)

5. **Clustering** (optional for lots of points): enable `cluster: true` on the GeoJSON source and add cluster/unclustered layers.  
   [Mapbox Clustering Example](https://docs.mapbox.com/mapbox-gl-js/example/cluster/?utm_source=chatgpt.com)

6. **Token security**: use environment variable for the token and **URL-restrict** it in Mapbox account.  
   [Mapbox Security Guide](https://docs.mapbox.com/help/troubleshooting/how-to-use-mapbox-securely/?utm_source=chatgpt.com)

7. **Pricing awareness**: monitor map loads/MAU.  
   [Mapbox Pricing](https://www.mapbox.com/pricing?utm_source=chatgpt.com)
