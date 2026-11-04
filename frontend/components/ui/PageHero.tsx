import Link from "next/link";
import Image from "next/image";

type PageHeroProps = {
  title: string;
  description?: string;
  breadcrumb: { label: string; href?: string }[];
  backgroundImage?: string;
  imageAlt?: string;
  imagePosition?: string;
  imageClassName?: string;
  imageOverlay?: { desktop: string; mobile: string };
  /** Phrase inside `description` to render in gold without changing the copy. */
  highlight?: string;
  headingId?: string;
};

const IMAGE_WIDTH = 2000;
const IMAGE_HEIGHT = 846;

// Transparent on the left (image is already deep blue, keeping the subject
// crisp) and tinted towards the right content area.
const DEFAULT_OVERLAY = {
  desktop:
    "linear-gradient(90deg,rgba(0,59,92,0)_0%,rgba(0,59,92,0.28)_18%,rgba(0,59,92,0.58)_36%,rgba(0,59,92,0.72)_60%,rgba(0,59,92,0.66)_100%)",
  mobile:
    "linear-gradient(160deg,rgba(0,59,92,0.4)_0%,rgba(0,59,92,0.64)_55%,rgba(0,59,92,0.78)_100%)",
};

function HighlightedDescription({ description, highlight }: { description: string; highlight?: string }) {
  const start = highlight ? description.indexOf(highlight) : -1;

  if (!highlight || start === -1) {
    return <>{description}</>;
  }

  const end = start + highlight.length;

  return (
    <>
      {description.slice(0, start)}
      <strong className="font-semibold text-accent">{highlight}</strong>
      {description.slice(end)}
    </>
  );
}

export default function PageHero({
  title,
  description,
  breadcrumb,
  backgroundImage,
  imageAlt = "",
  imagePosition = "object-center",
  imageClassName = "",
  imageOverlay = DEFAULT_OVERLAY,
  highlight,
  headingId,
}: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-primary-deep">
      {backgroundImage ? (
        <>
          <div className="absolute inset-0">
            <Image
              src={backgroundImage}
              alt={imageAlt}
              width={IMAGE_WIDTH}
              height={IMAGE_HEIGHT}
              priority
              className={`absolute top-1/2 left-1/2 min-h-full min-w-full max-w-none -translate-x-1/2 -translate-y-1/2 object-cover ${imagePosition} ${imageClassName}`}
              sizes="100vw"
            />
          </div>
          <div
            aria-hidden="true"
            className="absolute inset-0 hidden lg:block"
            style={{ backgroundImage: imageOverlay.desktop }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 lg:hidden"
            style={{ backgroundImage: imageOverlay.mobile }}
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
      {/* Slight navy tint under the fixed transparent header so its links
          stay legible whatever part of the photo sits beneath it. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-32 bg-[linear-gradient(to_bottom,rgba(0,59,92,0.45),rgba(0,59,92,0))]"
      />
      <div className="relative mx-auto w-full max-w-7xl px-4 pb-24 pt-36 sm:px-6 sm:pb-28 sm:pt-40 lg:px-8 lg:pb-32">
        <nav aria-label="Breadcrumb" className="animate-rise">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
            {breadcrumb.map((item, index) => (
              <li key={item.label} className="flex items-center gap-2">
                {index > 0 ? (
                  <span aria-hidden="true" className="text-accent">
                    /
                  </span>
                ) : null}
                {item.href ? (
                  <Link
                    href={item.href}
                    className="text-primary-soft transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="font-semibold text-white" aria-current="page">
                    {item.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <h1
          id={headingId}
          className="animate-rise mt-6 max-w-3xl font-display text-4xl font-bold tracking-tight text-white [animation-delay:100ms] sm:text-5xl [text-shadow:0_2px_18px_rgba(0,59,92,0.45)]"
        >
          {title}
        </h1>
        <span
          aria-hidden="true"
          className="animate-rise mt-6 block h-1 w-16 rounded-full bg-accent [animation-delay:150ms]"
        />
        {description ? (
          <p className="animate-rise mt-6 max-w-2xl text-lg leading-[1.6] text-primary-soft [animation-delay:200ms]">
            <HighlightedDescription description={description} highlight={highlight} />
          </p>
        ) : null}
      </div>
    </section>
  );
}
