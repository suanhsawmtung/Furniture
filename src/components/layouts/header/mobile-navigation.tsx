import LogoIcon from "@/components/icons/logo-icon";
import MenuIcon from "@/components/icons/menu-icon";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { NavigationProps } from "@/types";
import { useEffect, useState } from "react";
import { Link } from "react-router";

export const MobileNavigation = ({
  title,
  description,
  items,
}: NavigationProps) => {
  const [isDesktop, setIsDesktop] = useState(false);
  const query = "(min-width: 1024px)";

  useEffect(() => {
    const onChange = (event: MediaQueryListEvent) => {
      setIsDesktop(event.matches);
    };

    const result = matchMedia(query);
    result.addEventListener("change", onChange);

    return () => result.removeEventListener("change", onChange);
  }, []);

  if (isDesktop) {
    return null; // Do not render footer on desktop view
  }

  return (
    <div className="block lg:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <MenuIcon aria-hidden className="size-7" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="pt-12">
          <SheetHeader>
            <SheetTitle>
              <SheetClose asChild>
                <Link to="/" className="flex items-center gap-x-2">
                  <LogoIcon
                    className="text-primary size-8"
                    aria-hidden={true}
                  />
                  <h1 className="text-lg">{title}</h1>
                  <span className="sr-only">Home</span>
                </Link>
              </SheetClose>
            </SheetTitle>
            <SheetDescription>{description}</SheetDescription>
          </SheetHeader>

          <ScrollArea className="h-[calc(100vh-10rem)] w-full p-4">
            {items.map((item) => (
              <Accordion type="single" collapsible key={item.title}>
                <AccordionItem value={item.title}>
                  <AccordionTrigger>{item.title}</AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-y-2">
                    {item.card?.map((card) => (
                      <SheetClose asChild key={card.title}>
                        <Link
                          className="text-muted-foreground hover:bg-accent hover:text-accent-foreground block py-2 ps-4"
                          to={card.href || "/"}
                        >
                          {card.title}
                        </Link>
                      </SheetClose>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}

            {items.map((item) => (
              <div key={item.title}>
                {item.menu?.map((menu) => (
                  <SheetClose asChild key={menu.title}>
                    <Link
                      className="hover:bg-accent hover:text-accent-foreground block py-2 text-sm font-medium"
                      to={menu.href || "/"}
                    >
                      {menu.title}
                    </Link>
                  </SheetClose>
                ))}
              </div>
            ))}
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
};
