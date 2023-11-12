const BackgroundComponent = () => {
  return (
    <div className="background-effect z-[-1] pointer-events-none fixed top-0 left-0 w-full h-full bg-background">
      <div className="h-[120%] w-48 rotate-[-45deg] translate-y-36 fixed top-0 left-[10%] blur-[150px] bg-gradient-to-tr from-primary-100/50 to-secondary-100/50"></div>
      <div className="h-[85%] w-48 rotate-[-45deg] -translate-y-3 fixed top-0 right-[10%] blur-[150px] bg-gradient-to-tr from-primary-100 to-secondary-100"></div>
    </div>
  );
};

export default BackgroundComponent;
