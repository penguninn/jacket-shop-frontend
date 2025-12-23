import { usePublicProducts } from "@/features/products";
import { ProductCard } from "@/features/products/components/ProductCard";
import { Button } from "@/shared/ui/button";
import { Link } from "react-router-dom";
import type { Product } from "@/features/products/model/schemas";

interface ProductSectionProps {
  title: string;
  products: Product[];
  viewAllUrl: string;
}

function ProductSection({ title, products, viewAllUrl }: ProductSectionProps) {
  if (!products.length) return null;

  return (
    <section className="py-12 border-b border-gray-100 last:border-0">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-extrabold text-center mb-12 uppercase font-integral-cf">
          {title}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {products.map((product) => (
            <div key={product.id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <Link to={viewAllUrl}>
            <Button variant="outline" className="min-w-[200px] h-12 rounded-full text-base font-medium px-12 border-gray-200 hover:bg-black hover:text-white transition-colors">
              View All
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { data: newArrivals } = usePublicProducts({
    page: 0,
    size: 4,
    sortBy: "id",
    sortDir: "DESC",
  });

  const { data: topSelling } = usePublicProducts({
    page: 0,
    size: 4,
    sortBy: "soldCount",
    sortDir: "DESC",
  });

  const { data: featured } = usePublicProducts({
    page: 0,
    size: 4,
    isFeatured: true,
  });

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      {/* Hero Section */}
      <div className="container mx-auto py-2 relative aspect-[3/1] mb-12">
        <img
          src="/featured.png"
          alt="Featured Collection"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex flex-col gap-4">
        <ProductSection
          title="New Arrivals"
          products={newArrivals?.contents || []}
          viewAllUrl="/search?sortBy=id&sortDir=DESC"
        />

        <ProductSection
          title="Top Selling"
          products={topSelling?.contents || []}
          viewAllUrl="/search?sortBy=soldCount&sortDir=DESC"
        />

        <ProductSection
          title="Featured Products"
          products={featured?.contents || []}
          viewAllUrl="/search?isFeatured=true"
        />
      </div>
    </div>
  );
}
