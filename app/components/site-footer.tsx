const SITE_NAME = "demo-ilie";

interface SiteFooterProps {
  /** Year shown in the copyright line. Defaults to the current year. */
  year?: number;
}

export function SiteFooter({ year = new Date().getFullYear() }: SiteFooterProps) {
  return (
    <footer className="site-footer">
      <p>
        &copy; {year} {SITE_NAME}. All rights reserved.
      </p>
    </footer>
  );
}
