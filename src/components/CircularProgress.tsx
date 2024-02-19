import "./CircularProgress.css";

function CircularProgress({
  size = "md",
}: {
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const sizeMap = {
    sm: "h-5 w-5 circular-progress-sm",
    md: "h-6 w-6 circular-progress-md",
    lg: "h-8 w-8 circular-progress-lg",
    xl: "h-10 w-10 circular-progress-xl",
  };
  return (
    <div className={`circular-progress ${sizeMap[size]}`}>
      <div className="inner"></div>
      <div className="outer"></div>
    </div>
  );
}

export default CircularProgress;
