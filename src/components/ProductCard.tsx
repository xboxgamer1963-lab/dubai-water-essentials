import { Loader2 } from "lucide-react";
import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCartStore } from "@/stores/cartStore";
import type { ShopifyProduct } from "@/lib/shopify";

interface ProductCardProps {
  product: ShopifyProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const isLoading = useCartStore((state) => state.isLoading);

  const variant = product.node.variants.edges[0]?.node;
  const image = product.node.images.edges[0]?.node;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!variant) return;

    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
  };

  return (
    <Card className="group overflow-hidden border border-border bg-card transition-all hover:shadow-md">
      <Link to="/product/$handle" params={{ handle: product.node.handle }}>
        <div className="aspect-square overflow-hidden bg-muted">
          {image ? (
            <img
              src={image.url}
              alt={image.altText ?? product.node.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              No image
            </div>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        <Link to="/product/$handle" params={{ handle: product.node.handle }}>
          <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {product.node.title}
          </h3>
        </Link>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
          {product.node.description || "No description available"}
        </p>
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="font-bold text-foreground">
            {product.node.priceRange.minVariantPrice.currencyCode}{" "}
            {parseFloat(product.node.priceRange.minVariantPrice.amount).toFixed(2)}
          </span>
          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={isLoading || !variant || !variant.availableForSale}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add to Cart"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
