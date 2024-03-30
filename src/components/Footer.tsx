// TODO: Add footer

import {GrGithub} from "react-icons/gr";
import {SiKofi} from "react-icons/si";
import {AnchorHTMLAttributes} from "react";
import {BsTwitch} from "react-icons/bs";

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: React.ReactNode,
}

const Link = ({
                href,
                children,
                target = "_blank",
                rel = "noopener noreferrer",
              }: LinkProps) => {
  return (
    <a href={href} target={target} rel={rel} className={
      "inline-flex items-center gap-1 text-red-600 dark:text-red-400 hover:text-rose-400 dark:hover:text-rose-600 transition-colors"
    }>
      {children}
    </a>
  );
};

function Footer() {
  return (
    <div className="footer bg-background/50 backdrop-blur-lg p-4 border-t border-accent">
      <div className="footer-content flex gap-10">
        <div className="footer-left flex flex-col justify-center">
          <div className="footer-title text-xl">Ani<span className="text-primary">List</span> Rescorer</div>
          <div className="footer-subtitle">A tool to quickly rescore your AniList entries.</div>
        </div>
        <div className="footer-left">
          <div className="footer-links flex flex-col flex-wrap *:flex *:flex-row *:items-center *:gap-1">
            <Link href="https://github.com/Kex1016/anilist-rescorer">
              <GrGithub/> GitHub
            </Link>
            <Link href="https://ko-fi.com/the_cakes">
              <SiKofi/> Ko-fi
            </Link>
            <Link href="https://twitch.tv/cakesislive">
              <BsTwitch/> Twitch
            </Link>
          </div>
        </div>
        <div className="footer-right ml-auto flex flex-col justify-center text-right">
          <div className="footer-legal">© {new Date().getFullYear()} <Link href="https://anilist.co/user/cakes">cakes</Link></div>
          <div>
            Made with <span className="text-red-500">&lt;3</span> from Hungary
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
