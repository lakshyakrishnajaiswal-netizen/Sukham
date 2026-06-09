import Image from "next/image";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`relative shrink-0 ${compact ? "h-12 w-32" : "h-14 w-44 sm:w-52"}`}>
      <Image
        src="/images/sukham-logo.png"
        alt="Sukham Yoga & Physiotherapy Centre"
        fill
        sizes={compact ? "128px" : "208px"}
        className="object-contain object-left"
        priority
      />
    </div>
  );
}
