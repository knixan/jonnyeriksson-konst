export function FormField({
  label,
  error,
  className,
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label
      className={`flex flex-col gap-1 text-sm text-primary ${className ?? ""}`}
    >
      {label}
      {children}
      {error ? <span className="text-xs text-destructive">{error}</span> : null}
    </label>
  );
}
