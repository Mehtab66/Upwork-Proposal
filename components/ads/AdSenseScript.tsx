import Script from "next/script";
import { ADSENSE_CLIENT } from "@/lib/ads/config";

export function AdSenseScript() {
  if (!ADSENSE_CLIENT) {
    return null;
  }

  return (
    <Script
      id="adsense-script"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
