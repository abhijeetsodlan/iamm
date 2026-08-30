"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { ButtonLink } from "@/components/ui/Button";
import { siteConfig } from "@/lib/site";

function BackIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.99 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.78 9.79Z" />
    </svg>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);

  function toggleTheme() {
    const next = !document.documentElement.classList.contains("dark");

    document.documentElement.classList.toggle("dark", next);

    localStorage.setItem("theme", next ? "dark" : "light");

    setDark(next);
  }

  function closeMenu() {
    setOpen(false);
  }

  function goBack() {
    closeMenu();

    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/");
  }

  const showMobileBack = pathname !== "/";

  const themeAriaLabel = dark
    ? "Switch to light theme"
    : "Switch to dark theme";

  const ThemeIcon = dark ? MoonIcon : SunIcon;

  // Fixed dark styling for navbar in both light and dark themes
  const iconButtonClass =
    "flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-white/5 text-white transition hover:-translate-y-0.5 hover:border-primary/50 hover:bg-white/10 hover:text-primary active:translate-y-0 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25 motion-reduce:transform-none";

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0f1c]/90 text-white backdrop-blur-xl">
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8"
        aria-label="Primary navigation"
      >
        {/* Logo and Back Button */}
        <div className="flex items-center gap-2">
          {showMobileBack ? (
            <button
              type="button"
              aria-label="Go back"
              title="Go back"
              onClick={goBack}
              className={`${iconButtonClass} lg:hidden`}
            >
              <BackIcon />
            </button>
          ) : null}

          <Link
            href="/"
            onClick={closeMenu}
            className="flex items-center font-semibold text-white"
          >
            <BrandLogo
              priority
              imageClassName="h-11 w-36"
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 lg:flex">
          {siteConfig.nav.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-3 py-2 text-sm font-medium transition hover:bg-white/10 ${
                  active
                    ? "text-primary"
                    : "text-white/65 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 lg:flex">
          <button
            type="button"
            aria-label={themeAriaLabel}
            title={themeAriaLabel}
            onClick={toggleTheme}
            className={iconButtonClass}
          >
            <ThemeIcon />
          </button>

          <ButtonLink href="/assessment">
            Free AI Assessment
          </ButtonLink>
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-2 lg:hidden">
          {/* Theme Toggle */}
          <button
            type="button"
            aria-label={themeAriaLabel}
            title={themeAriaLabel}
            onClick={toggleTheme}
            className={iconButtonClass}
          >
            <ThemeIcon />
          </button>

          {/* Mobile Menu Button */}
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-md border border-white/10 bg-white/5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25"
          >
            <span
              className={`h-0.5 w-5 rounded bg-white transition ${
                open ? "translate-y-2 rotate-45" : ""
              }`}
            />

            <span
              className={`h-0.5 w-5 rounded bg-white transition ${
                open ? "opacity-0" : ""
              }`}
            />

            <span
              className={`h-0.5 w-5 rounded bg-white transition ${
                open ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      <div
        className={`grid border-t border-white/10 bg-[#0a0f1c] transition-all duration-200 lg:hidden ${
          open
            ? "grid-rows-[1fr]"
            : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="space-y-1 px-6 py-4">
            {siteConfig.nav.map((item) => {
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className={`block rounded-md px-3 py-3 text-base font-medium transition hover:bg-white/10 ${
                    active
                      ? "text-primary"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            <ButtonLink
              href="/assessment"
              onClick={closeMenu}
              className="mt-3 w-full"
            >
              Free AI Assessment
            </ButtonLink>
          </div>
        </div>
      </div>
    </header>
  );
}