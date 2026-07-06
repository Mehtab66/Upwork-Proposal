import { cn } from "@/lib/utils";

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizes = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function Avatar({ src, alt, name = "User", size = "md", className }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt || name}
        className={cn(
          "rounded-full object-cover ring-2 ring-primary/20",
          sizes[size],
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded-full bg-primary-light text-primary font-semibold flex items-center justify-center ring-2 ring-primary/20",
        sizes[size],
        className
      )}
      aria-label={name}
    >
      {getInitials(name)}
    </div>
  );
}
