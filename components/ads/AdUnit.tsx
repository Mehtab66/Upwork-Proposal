"use client";

import { useEffect, useRef } from "react";
import { ADSENSE_CLIENT, ADSENSE_SLOT } from "@/lib/ads/config";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

interface AdUnitProps {
  slot?: string;
  className?: string;
  format?: string;
}

export function AdUnit({
  slot,
  className,
  format = "auto",
}: AdUnitProps) {
  const pushed = useRef(false);
  const adSlot = slot?.trim() || ADSENSE_SLOT;

  useEffect(() => {
    if (!ADSENSE_CLIENT || !adSlot || pushed.current) {
      return;
    }

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
      pushed.current = true;
    } catch (error) {
      console.warn("AdSense push failed:", error);
    }
  }, [adSlot]);

  if (!ADSENSE_CLIENT || !adSlot) {
    return null;
  }

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: "block", minHeight: 120, width: "100%" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={adSlot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
