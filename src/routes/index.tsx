import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PackageSearch, Truck, ShieldCheck, Recycle, Droplets } from "lucide-react";

import { ProductCard } from "@/components/ProductCard";
import { fetchProducts, type ShopifyProduct } from "@/lib/shopify";
import dubaiHero from "@/assets/dubai-hero.jpg";

const productsQueryOptions = {
  queryKey: ["shopify-products"],
  queryFn: () => fetchProducts(50),
};

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQueryOptions),
  component: Index,
  head: () => ({
    meta: [
      { title: "Delite UAE | Quality Plastic Products" },
      {
        name: "description",
        content:
          "Shop premium plastic household products in Dubai. Water dispensers, bottles, hangers, and more from Delite UAE.",
      },
      { property: "og:title", content: "Delite UAE | Quality Plastic Products" },
      {
        property: "og:description",
        content:
          "Shop premium plastic household products in Dubai. Water dispensers, bottles, hangers, and more from Delite UAE.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function Index() {
  const { data: products } = useSuspenseQuery(productsQueryOptions);
  const typedProducts = (products ?? []) as ShopifyProduct[];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative isolate flex min-h-[88vh] items-center overflow-hidden">
        <img
          src={dubaiHero}
          alt="Dubai skyline at golden hour across the water"
          width={1920}
          height={1088}
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-linear-to-r from-primary/90 via-primary/70 to-primary/20" />

        <div className="container mx-auto px-6 py-24">
          <div className="max-w-2xl">
            <span className="inline-block border border-accent/60 px-4 py-2 text-[0.65rem] uppercase tracking-[0.4em] text-accent">
              Made for the Emirates
            </span>
            <h1 className="mt-8 text-5xl leading-[1.05] tracking-tight text-primary-foreground md:text-7xl">
              Everyday essentials,
              <span className="block italic text-accent">crafted for Dubai homes</span>
            </h1>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-primary-foreground/80 md:text-lg">
              Water dispensers, bottles and hangers built to last through Gulf summers. Designed,
              stocked and delivered across the UAE — from our warehouse to your door.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="#collection"
                className="inline-flex items-center bg-accent px-8 py-4 text-xs uppercase tracking-[0.25em] text-accent-foreground transition-opacity hover:opacity-90"
              >
                Shop the collection
              </a>
              <a
                href="#about"
                className="inline-flex items-center border border-primary-foreground/40 px-8 py-4 text-xs uppercase tracking-[0.25em] text-primary-foreground transition-colors hover:bg-primary-foreground/10"
              >
                Why Delite
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y border-border bg-secondary/50">
        <div className="container mx-auto grid grid-cols-2 gap-8 px-6 py-10 md:grid-cols-4">
          {[
            { icon: Truck, label: "UAE-wide delivery", note: "Dubai next-day" },
            { icon: ShieldCheck, label: "Food-grade safe", note: "BPA-free materials" },
            { icon: Droplets, label: "Built for the heat", note: "Gulf-tested durability" },
            { icon: Recycle, label: "Recyclable", note: "Responsibly produced" },
          ].map(({ icon: Icon, label, note }) => (
            <div key={label} className="flex items-start gap-4">
              <Icon className="mt-1 h-5 w-5 shrink-0 text-accent" />
              <div>
                <p className="text-sm font-medium text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground">{note}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Collection */}
      <section id="collection" className="container mx-auto px-6 py-24">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
          <div>
            <span className="text-[0.65rem] uppercase tracking-[0.4em] text-accent">
              The Collection
            </span>
            <h2 className="mt-3 text-4xl tracking-tight text-foreground md:text-5xl">
              Our Products
            </h2>
          </div>
          <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
            {typedProducts.length} items
          </span>
        </div>

        {typedProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center border border-dashed border-border bg-muted/30 py-24 text-center">
            <PackageSearch className="h-16 w-16 text-muted-foreground/60" />
            <h3 className="mt-6 text-2xl text-foreground">No products found</h3>
            <p className="mt-2 max-w-md px-6 text-sm text-muted-foreground">
              Your Shopify store is connected, but it does not have any products yet. Tell me what
              products you would like to add — for example, a small water dispenser for AED 45 — and
              I will create them for you.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {typedProducts.map((product) => (
              <ProductCard key={product.node.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* About */}
      <section id="about" className="bg-primary text-primary-foreground">
        <div className="container mx-auto grid gap-14 px-6 py-24 md:grid-cols-2 md:items-center">
          <div>
            <span className="text-[0.65rem] uppercase tracking-[0.4em] text-accent">
              Est. in Dubai
            </span>
            <h2 className="mt-4 text-4xl leading-tight md:text-5xl">
              A local name in <span className="italic text-accent">household plastics</span>
            </h2>
            <p className="mt-6 max-w-lg leading-relaxed text-primary-foreground/75">
              From Al Quoz to Jumeirah, Delite supplies homes, offices and hospitality across the
              Emirates. Every item is selected for the realities of life in the Gulf — heat, humidity
              and constant use — and priced honestly in AED.
            </p>
          </div>
          <dl className="grid grid-cols-2 gap-px overflow-hidden border border-primary-foreground/15 bg-primary-foreground/15">
            {[
              ["7", "Emirates served"],
              ["48h", "Typical delivery"],
              ["100%", "BPA-free range"],
              ["AED", "Local pricing"],
            ].map(([value, label]) => (
              <div key={label} className="bg-primary p-8">
                <dt className="font-display text-4xl text-accent">{value}</dt>
                <dd className="mt-2 text-xs uppercase tracking-[0.2em] text-primary-foreground/70">
                  {label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <footer className="border-t border-border bg-background">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-6 py-10 text-xs uppercase tracking-[0.25em] text-muted-foreground md:flex-row">
          <span className="font-display text-lg tracking-[0.2em] text-primary">DELITE UAE</span>
          <span>Dubai, United Arab Emirates</span>
          <span>&copy; {new Date().getFullYear()} Delite UAE</span>
        </div>
      </footer>
    </div>
  );
}
