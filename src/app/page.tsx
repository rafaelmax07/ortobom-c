import { HeroSlider } from "@/components/ui/HeroSlider";
import { CategoryGrid } from "@/components/ui/CategoryGrid";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <HeroSlider />

      <CategoryGrid />

      {/* Featured Products Placeholder */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Destaques da Semana</h2>
          <p className="text-gray-500">Em breve...</p>
        </div>
      </section>
    </main>
  );
}
