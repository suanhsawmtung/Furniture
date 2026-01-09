import AuthDropdown from "@/components/layouts/header/auth-dropdown";
import CartSheet from "@/components/layouts/header/cart-sheet";
import { MainNavigation } from "@/components/layouts/header/main-navigation";
import { MobileNavigation } from "@/components/layouts/header/mobile-navigation";
import { ModeToggle } from "@/components/layouts/header/mode-toggle";
import ContentWrapper from "@/components/wrapper/content-wrapper";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth.store";
import { useEffect, useState } from "react";

export const Header = () => {
  const [isScrollingUp, setIsScrollingUp] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isAtTop, setIsAtTop] = useState(true);

  const authUser = useAuthStore((state) => state.authUser);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsAtTop(currentScrollY === 0);

      if (currentScrollY < 10) {
        setIsScrollingUp(true);
      } else {
        setIsScrollingUp(currentScrollY < lastScrollY);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 z-50 w-full border-b transition-transform duration-300",
        isAtTop ? "bg-transparent" : "bg-background",
        isScrollingUp ? "translate-y-0" : "-translate-y-full",
      )}
    >
      <ContentWrapper className="flex h-16 items-center justify-between">
        <nav>
          <MainNavigation
            title={siteConfig.name}
            description={siteConfig.description}
            items={siteConfig.mainNav}
          />

          <MobileNavigation
            title={siteConfig.name}
            description={siteConfig.description}
            items={siteConfig.mainNav}
          />
        </nav>

        <div className="flex items-center justify-end gap-x-4">
          <CartSheet />

          <ModeToggle />

          <AuthDropdown user={authUser} />
        </div>
      </ContentWrapper>
    </header>
  );
};
