import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PackageSearch } from "lucide-react";

import { ProductCard } from "@/components/ProductCard";
import { fetchProducts, type ShopifyProduct } from "@/lib/shopify";

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
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/30 py-20 md:py-28">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground md:text-6xl">
            Quality Plastic Products for Every Home
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Discover durable, practical household essentials from Delite UAE — water dispensers,
            bottles, hangers, and more, delivered across Dubai.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="mb-10 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Our Products</h2>
          <span className="text-sm text-muted-foreground">{typedProducts.length} products</span>
        </div>

        {typedProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 py-24 text-center">
            <PackageSearch className="h-16 w-16 text-muted-foreground/60" />
            <h3 className="mt-6 text-xl font-semibold text-foreground">No products found</h3>
            <p className="mt-2 max-w-md text-muted-foreground">
              Your Shopify store is connected, but it does not have any products yet. Tell me what
              products you would like to add — for example, a small water dispenser for AED 45 — and
              I will create them for you.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {typedProducts.map((product) => (
              <ProductCard key={product.node.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
