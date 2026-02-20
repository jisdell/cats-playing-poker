export function TypographyH3({
  children,
  className,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <h3
      className={`scroll-m-20 text-2xl font-semibold tracking-tight ${className}`}
    >
      {children}
    </h3>
  )
}
