import type { ReactNode } from 'react'

interface ContainerProps {
    className?: string
    children: ReactNode
}

export function Container({ className, children }: ContainerProps) {
    return (
        <div
            className={[
                'w-full mx-auto px-4',
                'sm:max-w-[720px]',
                'md:max-w-[960px]',
                'lg:max-w-[1140px]',
                'xl:max-w-[1320px]',
                className,
            ]
                .filter(Boolean)
                .join(' ')}
        >
            {children}
        </div>
    )
}
