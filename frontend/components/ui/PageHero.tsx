import Link from "next/link";
import Image from "next/image";

type PageHeroProps = {
  title: string;
  description?: string;
  breadcrumb: { label: string; href?: string }[];
  backgroundImage?: string;
};

export default function PageHero({ title, description, breadcrumb, backgroundImage }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-primary-deep">
      {backgroundImage ? (
        <>
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src={backgroundImage}
              alt=""
              aria-hidden="true"
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          </div>
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,59,92,0.88)_0%,rgba(0,59,92,0.62)_45%,rgba(0,59,92,0.12)_100%)]"
          />
        </>
      ) : (
        <>
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(120deg,#003B5C_0%,#2774AE_55%,#8BB8EE_100%)] opacity-95"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:48px_48px]"
          />
        </>
      )}
      <div className="relative mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-silver">
            {breadcrumb.map((item, index) => (
              <li key={item.label} className="flex items-center gap-2">
                {index > 0 ? <span aria-hidden="true">/</span> : null}
                {item.href ? (
                  <Link href={item.href} className="transition-colors hover:text-white">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-white" aria-current="page">
                    {item.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <h1 className="mt-6 max-w-3xl font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-silver sm:text-lg">
            {description}
          </p>
        ) : null}
      </div>
    </section>
  );
}