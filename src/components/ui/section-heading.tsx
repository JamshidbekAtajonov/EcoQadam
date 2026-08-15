import Link from "next/link";

export function SectionHeading({ title, description, href, linkLabel = "Barchasini ko‘rish" }: {
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="section-heading">
      <div><h2>{title}</h2>{description && <p>{description}</p>}</div>
      {href && <Link href={href}>{linkLabel} <span>→</span></Link>}
    </div>
  );
}
