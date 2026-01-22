'use client'

import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'

export default function TestConnectionPage() {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<any>(null)
    const [products, setProducts] = useState<any[]>([])

    useEffect(() => {
        async function fetchProducts() {
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select('*, variants(*)')
                    .order('created_at', { ascending: false })

                if (error) throw error
                setProducts(data || [])
            } catch (err: any) {
                setError(err)
                console.error('Unexpected Error:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchProducts()
    }, [])

    if (loading) {
        return (
            <div className="p-8 max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-4">Teste de Conexão Supabase</h1>
                <div className="bg-blue-100 p-4 rounded text-blue-700">
                    Carregando produtos...
                </div>
            </div>
        )
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Teste de Conexão Supabase</h1>

            {error && (
                <div className="bg-red-100 p-4 rounded text-red-700 mb-4">
                    Erro: {error.message}
                </div>
            )}

            {!error && products && (
                <div className="space-y-6">
                    <div className="bg-green-100 p-4 rounded text-green-700">
                        ✅ Conectado com sucesso! Encontrados {products.length} produtos.
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {products.map((product) => (
                            <div key={product.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition">
                                <div className="aspect-video relative mb-3 bg-gray-100 overflow-hidden rounded">
                                    {product.featured_image ? (
                                        <img src={product.featured_image} alt={product.name} className="object-cover w-full h-full" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-400">Sem Imagem</div>
                                    )}
                                </div>
                                <h2 className="font-semibold text-lg">{product.name}</h2>
                                <p className="text-sm text-gray-500 mb-2">{product.slug}</p>

                                {product.variants && product.variants.length > 0 ? (
                                    <div className="text-blue-600 font-bold">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.variants[0].price)}
                                    </div>
                                ) : (
                                    <div className="text-gray-400 text-sm">Sem preço/variação</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
