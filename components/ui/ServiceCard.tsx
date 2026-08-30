import { ButtonLink } from "@/components/ui/Button";

type ServiceCardProps = {
  icon: string;
  title: string;
  description: string;
  benefits?: string[];
  useCases?: string[];
  detailed?: boolean;
};

function preventWidow(text: string) {
  const lastSpace = text.lastIndexOf(" ");

  if (lastSpace === -1) {
    return text;
  }

  return `${text.slice(0, lastSpace)}\u00A0${text.slice(lastSpace + 1)}`;
}

export function ServiceCard({
  icon,
  title,
  description,
  benefits = [],
  useCases = [],
  detailed = false,
}: ServiceCardProps) {
  return (
    <article className="group h-full rounded-lg border border-border bg-surface p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 motion-reduce:transform-none">
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-md bg-primary/10 text-sm font-bold text-primary ring-1 ring-primary/15">
        {icon}
      </div>
      <h3 className="text-pretty text-xl font-semibold text-foreground">{preventWidow(title)}</h3>
      <p className={`mt-3 text-pretty leading-7 text-muted-foreground ${detailed ? "" : "line-clamp-3"}`}>{preventWidow(description)}</p>
      {!detailed ? (
        <ButtonLink href="/services" variant="ghost" className="mt-5 px-0 hover:bg-transparent">
          Learn more
        </ButtonLink>
      ) : null}
      {detailed ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-foreground">Benefits</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{preventWidow(benefit)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Use cases</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {useCases.map((useCase) => (
                <li key={useCase} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>{preventWidow(useCase)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </article>
  );
}



