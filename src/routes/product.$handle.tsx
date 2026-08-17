import { createFileRoute, notFound } from "@tanstack/react-router";
import { Loader2, Minus, Plus, ShoppingCart } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import { fetchProductByHandle, type ShopifyProduct } from "@/lib/shopify";

export const Route = createFileRoute("/product/$handle")({
  loader: async ({ params }) => {
    const product = await fetchProductByHandle(params.handle);
    if (!product) throw notFound();
    return product;
  },
  component: ProductPage,
  head: ({ params }) => ({
    meta: [
      { title: `${params.handle} | Delite UAE` },
      { name: "description", content: "Shop quality plastic products at Delite UAE." },
      { property: "og:title", content: `${params.handle} | Delite UAE` },
      {
        property: "og:description",
        content: "Shop quality plastic products at Delite UAE.",
      },
      { property: "og:type", content: "product" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function ProductPage() {
  const product = Route.useLoaderData();
  const addItem = useCartStore((state) => state.addItem);
  const isLoading = useCartStore((state) => state.isLoading);

  const [selectedVariant, setSelectedVariant] = useState(product.variants.edges[0]?.node);
  const [quantity, setQuantity] = useState(1);

  const images = product.images.edges;
  const [selectedImage, setSelectedImage] = useState(images[0]?.node);

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    await addItem({
      product: { node: product } as ShopifyProduct,
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity,
      selectedOptions: selectedVariant.selectedOptions || [],
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-2xl border border-border bg-muted">
              {selectedImage ? (
                <img
                  src={selectedImage.url}
                  alt={selectedImage.altText ?? product.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                  No image available
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((image, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(image.node)}
                    className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border ${
                      selectedImage?.url === image.node.url
                        ? "border-primary ring-2 ring-primary"
                        : "border-border"
                    }`}
                  >
                    <img
                      src={image.node.url}
                      alt={image.node.altText ?? ""}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">{product.title}</h1>
              <p className="mt-4 text-2xl font-semibold text-foreground">
                {selectedVariant
                  ? `${selectedVariant.price.currencyCode} ${parseFloat(selectedVariant.price.amount).toFixed(2)}`
                  : ""}
              </p>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              {product.description || "No description available."}
            </p>

            {product.options.length > 0 && (
              <div className="space-y-4">
                {product.options.map((option) => (
                  <div key={option.name}>
                    <label className="text-sm font-medium text-foreground">{option.name}</label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {option.values.map((value) => (
                        <button
                          key={value}
                          onClick={() => {
                            const variant = product.variants.edges.find((v) =>
                              v.node.selectedOptions.some(
                                (o) => o.name === option.name && o.value === value,
                              ),
                            )?.node;
                            if (variant) setSelectedVariant(variant);
                          }}
                          className={`rounded-md border px-4 py-2 text-sm transition-colors ${
                            selectedVariant?.selectedOptions.some(
                              (o) => o.name === option.name && o.value === value,
                            )
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-background text-foreground hover:bg-accent"
                          }`}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-foreground">Quantity</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity((q) => q + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full sm:w-auto"
              onClick={handleAddToCart}
              disabled={isLoading || !selectedVariant || !selectedVariant.availableForSale}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
