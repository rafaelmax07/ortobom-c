'use client'

import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'

export default function TestConnectionPage() {
    const [status, setStatus] = useState<string>('Testing connection...')
    const [details, setDetails] = useState<string>('')

    useEffect(() => {
        async function testConnection() {
            try {
                // Tenta fazer um select simples na tabela categories
                const { data, error, count } = await supabase
                    .from('categories')
                    .select('*', { count: 'exact', head: true })

                if (error) {
                    setStatus('❌ Connection Error')
                    setDetails(error.message)
                    console.error('Supabase Error:', error)
                    // Dica específica para erro de tabela não encontrada
                    if (error.code === '42P01') {
                        setDetails(`${error.message} (Did you run the schema.sql in Supabase?)`)
                    }
                } else {
                    setStatus('✅ Connection Successful!')
                    setDetails(`Connected to Supabase. Found ${count} categories (or table is empty but accessible).`)
                }
            } catch (err: any) {
                setStatus('❌ Unexpected Error')
                setDetails(err.message)
            }
        }

        testConnection()
    }, [])

    return (
        <div className="p-10 font-sans">
            <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
            <div className={`p-4 rounded border ${status.includes('Error') ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                <h2 className="text-xl font-semibold">{status}</h2>
                <p className="mt-2 font-mono text-sm text-gray-700">{details}</p>
            </div>
            <div className="mt-6 text-sm text-gray-500">
                <p>Check <code>.env.local</code> if you see connection errors.</p>
                <p>Check Supabase SQL Editor if you see "relation does not exist".</p>
            </div>
        </div>
    )
}
