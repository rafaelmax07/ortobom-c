import Link from 'next/link'

interface BreadcrumbItem {
    label: string
    href?: string
}

interface BreadcrumbProps {
    items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
    return (
        <nav aria-label="breadcrumb">
            <ol className="flex items-center gap-1 text-xs">
                {items.map((item, idx) => {
                    const isLast = idx === items.length - 1
                    const isCurrent = isLast || !item.href

                    return (
                        <li key={idx} className="flex items-center gap-1">
                            {isCurrent ? (
                                <span
                                    className="text-text-main"
                                    aria-current={isLast ? 'page' : undefined}
                                >
                                    {item.label}
                                </span>
                            ) : (
                                <Link
                                    href={item.href!}
                                    className="text-text-muted hover:text-primary"
                                >
                                    {item.label}
                                </Link>
                            )}
                            {!isLast && (
                                <span aria-hidden="true" className="text-text-muted">
                                    /
                                </span>
                            )}
                        </li>
                    )
                })}
            </ol>
        </nav>
    )
}
