// A container element with only tailwindcss classes
// ------------------------------------------------------

function Container({
  children,
  className = "",
  asMain = false,
  onAnimationEnd,
}: {
  children: React.ReactNode;
  className?: string;
  asMain?: boolean;
  onAnimationEnd?: React.AnimationEventHandler<HTMLDivElement>;
}) {
  if (asMain) {
    return (
      <main
        className={
          "container mx-auto px-4" + (className ? " " + className : "")
        }
        onAnimationEnd={onAnimationEnd}
      >
        {children}
      </main>
    );
  }

  return (
    <div
      className={"container mx-auto px-4" + (className ? " " + className : "")}
      onAnimationEnd={onAnimationEnd}
    >
      {children}
    </div>
  );
}

export default Container;
