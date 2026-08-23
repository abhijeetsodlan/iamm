type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  invert?: boolean;
};

function preventWidow(text: string) {
  const lastSpace = text.lastIndexOf(" ");

  if (lastSpace === -1) {
    return text;
  }

  return `${text.slice(0, lastSpace)}\u00A0${text.slice(lastSpace + 1)}`;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  invert = false,
}: SectionHeadingProps) {
  return (
    <div className={align === "center" ? "mx-auto max-w-4xl text-center" : "max-w-3xl"}>
      {eyebrow ? (
        <p className="mb-3 text-pretty text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={`text-balance text-3xl font-semibold tracking-tight sm:text-4xl ${
          invert ? "text-white" : "text-foreground"
        }`}
      >
        {preventWidow(title)}
      </h2>
      {description ? (
        <p className={`mt-4 text-pretty text-base leading-7 sm:text-lg ${invert ? "text-white/70" : "text-muted-foreground"}`}>
          {preventWidow(description)}
        </p>
      ) : null}
    </div>
  );
}
