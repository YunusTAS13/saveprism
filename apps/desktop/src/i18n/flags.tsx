import { cn } from "@/lib/utils";
import type { Language } from "./detect";
import { languageFlag, languageShortCode } from "./language";

interface FlagProps {
  className?: string;
}

/**
 * The round flag from the language's file, drawn as an image so the SVG can run nothing; a file
 * without a flag shows its short code instead.
 */
export function LanguageFlag({ language, className }: FlagProps & { language: Language }) {
  const flag = languageFlag(language);
  if (flag === undefined) {
    return (
      <span
        aria-hidden="true"
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-full bg-muted font-mono text-[0.5rem] font-semibold",
          className,
        )}
      >
        {languageShortCode(language)}
      </span>
    );
  }
  return (
    <img
      src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(flag)}`}
      alt=""
      aria-hidden="true"
      draggable={false}
      // The thin ring keeps white flag parts visible on a white menu.
      className={cn("shrink-0 rounded-full ring-1 ring-foreground/15", className)}
    />
  );
}
