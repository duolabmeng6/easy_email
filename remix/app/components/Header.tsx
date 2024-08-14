import { Link } from "@remix-run/react";
import { VmailLogo } from "./icons/vmail";
import { useTranslation } from "react-i18next";

export default function Header() {
  const { t } = useTranslation();
  return (
    <div className="fixed top-0 z-20 h-20 w-full px-5 backdrop-blur-xl md:px-10 text-white flex items-center justify-between first-letter:shadow-sm">
      <Link to="/" className="font-bold flex items-center justify-center gap-3">
        <VmailLogo />
        <button className="cool-btn">
          <span>EasyEmail</span>
        </button>
      </Link>

    </div>
  );
}
