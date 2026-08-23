import { ButtonLink } from "@/components/ui/Button";

type CtaBandProps = {
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

function preventWidow(text: string) {
  const lastSpace = text.lastIndexOf(" ");

  if (lastSpace === -1) {
    return text;
  }

  return `${text.slice(0, lastSpace)}\u00A0${text.slice(lastSpace + 1)}`;
}

export function CtaBand({
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: CtaBandProps) {
  return (
    <section className="bg-secondary py-20 text-white sm:py-24">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="max-w-3xl">
          <p className="mb-3 text-pretty text-sm font-semibold uppercase tracking-[0.18em] text-accent">
            Next step
          </p>
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">{preventWidow(title)}</h2>
          <p className="mt-4 max-w-2xl text-pretty text-lg leading-8 text-white/70">{preventWidow(description)}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
          <ButtonLink href={primaryHref}>{primaryLabel}</ButtonLink>
          {secondaryHref && secondaryLabel ? (
            <ButtonLink href={secondaryHref} variant="secondary" className="border-white/15 bg-white/5 text-white hover:bg-white/10">
              {secondaryLabel}
            </ButtonLink>
          ) : null}
        </div>
      </div>
    </section>
  );
}
