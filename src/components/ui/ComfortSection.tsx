import Link from 'next/link'
import Image from 'next/image'

export function ComfortSection() {
    return (
        <section className="py-10 bg-bg-light border-t border-b border-border">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Card 1 */}
                    <Link href="/c/colchoes" className="group relative overflow-hidden rounded-lg aspect-[3/2] block bg-navy-medium">
                        <Image
                            src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=600&auto=format&fit=crop"
                            alt="Colchão ideal"
                            fill
                            className="object-cover opacity-40 group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, 33vw"
                            unoptimized
                        />
                        <div className="absolute inset-0 flex flex-col justify-end p-5 text-white">
                            <h3 className="font-bold text-base md:text-lg mb-1">3 PASSOS PARA O COLCHÃO DOS SEUS SONHOS</h3>
                            <p className="text-xs text-white/80">Saiba qual colchão combina mais com você e seu estilo</p>
                            <span className="mt-3 text-xs font-bold text-accent group-hover:text-accent-hover">Faça seu teste e descubra →</span>
                        </div>
                    </Link>

                    {/* Card 2 */}
                    <Link href="/c/camas" className="group relative overflow-hidden rounded-lg aspect-[3/2] block bg-navy-medium">
                        <Image
                            src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=600&auto=format&fit=crop"
                            alt="Bases"
                            fill
                            className="object-cover opacity-40 group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, 33vw"
                            unoptimized
                        />
                        <div className="absolute inset-0 flex flex-col justify-end p-5 text-white">
                            <h3 className="font-bold text-base md:text-lg mb-1">BASES</h3>
                            <p className="text-xs text-white/80">Estilo e funcionalidade se unem em nossa linha de Bases para cama</p>
                            <span className="mt-3 text-xs font-bold text-accent group-hover:text-accent-hover">Confira as opções →</span>
                        </div>
                    </Link>

                    {/* Card 3 */}
                    <Link href="/c/cabeceiras" className="group relative overflow-hidden rounded-lg aspect-[3/2] block bg-navy-medium">
                        <Image
                            src="https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=600&auto=format&fit=crop"
                            alt="Cabeceiras"
                            fill
                            className="object-cover opacity-40 group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, 33vw"
                            unoptimized
                        />
                        <div className="absolute inset-0 flex flex-col justify-end p-5 text-white">
                            <h3 className="font-bold text-base md:text-lg mb-1">CABECEIRAS</h3>
                            <p className="text-xs text-white/80">Encontre cabeceiras que combinam perfeitamente com seu estilo</p>
                            <span className="mt-3 text-xs font-bold text-accent group-hover:text-accent-hover">Clique e descubra →</span>
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    )
}
