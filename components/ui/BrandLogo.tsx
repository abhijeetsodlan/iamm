import Image from "next/image";

type BrandLogoProps = {
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  mode?: "auto" | "light" | "dark";
  showAdminLabel?: boolean;
};

export function BrandLogo({ className = "", imageClassName = "h-11 w-36", priority = false, mode = "auto", showAdminLabel = false }: BrandLogoProps) {
  const imageClasses = `${imageClassName} object-contain object-left`;

  return (
    <span className={`flex min-w-0 items-center gap-3 ${className}`}>
      {mode === "dark" ? (
        <Image src="/newfinallogo.png" alt="IAMM" width={144} height={48} priority={priority} className={imageClasses} />
      ) : null}
      {mode === "light" ? (
        <Image src="/newfinallogo.png" alt="IAMM" width={144} height={48} priority={priority} className={imageClasses} />
      ) : null}
      {mode === "auto" ? (
        <>
          <Image src="/newfinallogo.png" alt="IAMM" width={144} height={48} priority={priority} className={`${imageClasses} dark:hidden`} />
          <Image src="/newfinallogo.png" alt="IAMM" width={144} height={48} priority={priority} className={`${imageClasses} hidden dark:block`} />
        </>
      ) : null}
      {showAdminLabel ? <span className="shrink-0 text-xs text-muted-foreground">Admin</span> : null}
    </span>
  );
}


