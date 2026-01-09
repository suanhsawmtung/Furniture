import LogoIcon from "@/components/icons/logo-icon";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import type { NavigationProps } from "@/types";
import React from "react";
import { Link } from "react-router";

export const MainNavigation = ({
  title,
  description,
  items,
}: NavigationProps) => {
  return (
    <div className="hidden items-center lg:flex">
      <NavigationMenu className="space-x-5 xl:space-x-8" viewport={false}>
        <Link to="/">
          <div className="flex items-center gap-x-2">
            <LogoIcon className="text-primary size-8" aria-hidden={true} />
            <h1 className="text-xl font-semibold">{title}</h1>
            <span className="sr-only">Home</span>
          </div>
        </Link>

        <NavigationMenuList>
          {items.map((item) => (
            <NavigationMenuItem key={item.title}>
              <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <Link
                        className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-6 no-underline outline-hidden select-none focus:shadow-md"
                        to="/"
                      >
                        <LogoIcon className="text-primary size-6" />
                        <div className="text-lg font-medium">{title}</div>
                        <p className="text-muted-foreground text-sm leading-tight">
                          {description}
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  {item.card?.map((card) => (
                    <ListItem
                      key={card.title}
                      href={card.href || "/"}
                      title={card.title}
                    >
                      {card.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ))}

          {items.map((item) => (
            <React.Fragment key={item.title}>
              {item.menu?.map((menu) => (
                <NavigationMenuItem key={menu.title}>
                  <NavigationMenuLink
                    asChild
                    className={navigationMenuTriggerStyle()}
                  >
                    <Link to={menu.href || "/"}>{menu.title}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </React.Fragment>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link to={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
