interface LoaderProps {
  size?: "sm" | "md" | "lg";
}

export default function Loader({ size = "md" }: LoaderProps) {
  const sizeClasses = {
    sm: "w-5 h-5 border-2",
    md: "w-12 h-12 border-3",
    lg: "w-16 h-16 border-4",
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizeClasses[size]} border-rwanda-blue border-t-transparent rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}
