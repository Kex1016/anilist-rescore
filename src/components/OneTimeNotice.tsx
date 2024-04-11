import { useEffect, useState } from "react";
import { IconType } from "react-icons";
import { MdClose } from "react-icons/md";
import { Button } from "./ui/button";

type NoticeProps = {
  children: React.ReactNode;
  type: "destructive" | "primary" | "secondary";
  id: string;
  Icon: IconType;
};

function OneTimeNotice({ children, type, id, Icon }: NoticeProps) {
  // A component that displays a message with an icon on the top of the page.
  // The message only shows once and if its dismissed it never shows again.
  const [dismissed, setDismissed] = useState(false);
  const [doRender, setDoRender] = useState(true);

  useEffect(() => {
    // Get the type of the notice from local storage. It's stored in {"type": boolean} format.
    const notices = localStorage.getItem(`notices`);
    if (notices) {
      const parsed = JSON.parse(notices);
      if (parsed[id]) {
        setDoRender(false);
      }
    }
  }, [doRender, id]);

  if (!doRender) return null;

  return (
    <div
      className={
        `alert alert-${id} ` +
        "flex items-center justify-between px-4 py-1 text-sm rounded-md " +
        "border border-transparent " +
        "fixed top-15 left-0 right-0 z-50 " +
        "container mx-auto mt-4 " +
        "transition-all transform ease-in-out duration-300 " +
        `bg-${type} bg-${type}-foreground ` +
        (dismissed
          ? "translate-y-[-100%] opacity-0"
          : "translate-y-0 opacity-100")
      }
    >
      <span className="icon text-xl">
        <Icon />
      </span>
      <div>{children}</div>
      <Button
        variant={"ghost"}
        className="hover:bg-background/25"
        onClick={() => {
          setDismissed(true);
          const notices = localStorage.getItem(`notices`);
          if (notices) {
            const parsed = JSON.parse(notices);
            parsed[id] = true;
            localStorage.setItem(`notices`, JSON.stringify(parsed));
          } else {
            localStorage.setItem(`notices`, JSON.stringify({ [id]: true }));
          }
        }}
      >
        <MdClose />
      </Button>
    </div>
  );
}

export default OneTimeNotice;
