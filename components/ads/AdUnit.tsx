"use client";

import { useEffect, useRef } from "react";
import { ADSENSE_CLIENT } from "@/components/ads/AdSenseScript";

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
  const adSlot =
    slot?.trim() || process.env.NEXT_PUBLIC_ADSENSE_SLOT?.trim() || "";

  useEffect(() => {
    if (!ADSENSE_CLIENT || pushed.current) {
      return;
    }

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
      pushed.current = true;
    } catch (error) {
      console.warn("AdSense push failed:", error);
    }
  }, []);

  if (!ADSENSE_CLIENT) {
    return null;
  }

  return (
    <div className={className}>
      {adSlot ? (
        <ins
          className="adsbygoogle"
          style={{ display: "block", minHeight: 100, width: "100%" }}
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={adSlot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      ) : (
        <div className="flex min-h-[120px] w-full items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 px-4 text-center text-xs text-muted">
          Ad space — add{" "}
          <code className="mx-1">NEXT_PUBLIC_ADSENSE_SLOT</code> in env for a
          display unit (Auto ads still load from the site script).
        </div>
      )}
    </div>
  );
}
