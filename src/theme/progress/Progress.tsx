interface ProgressProps {
  value: number;
  className?: string;
}

export default function Progress({ value, className = "" }: ProgressProps) {
  return (
    <div
      className={`h-1 overflow-hidden rounded-full bg-stone-200 ${className}`}
    >
      <div
        className="h-full rounded-full bg-coral transition-all duration-300"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
