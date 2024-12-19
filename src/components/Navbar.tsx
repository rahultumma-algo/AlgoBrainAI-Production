import { useState, useEffect } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import { Button } from "@nextui-org/button";
import { components, blog, course } from "@/consts";
import { cn } from "@/lib/utils";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

type Props =
  | {
      hasBrowseSection?: false;
    }
  | {
      hasBrowseSection?: true;
      browseItems?: Array<{ label: string; href: string }>;
    };

export default function Navbar(props: Props) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;

      if (scrollTop > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isSmall = useMediaQuery("(max-width: 772px)");
  if (isSmall)
    return (
      <Drawer direction="right">
        <div
          className={`flex justify-between fixed top-0 left-0 z-40 items-center gap-3 mb-3 w-full ${
            isScrolled ? "bg-glass" : ""
          } px-4 py-2`}
        >
          <Button as="a" href="/" variant="light" className="text-sm">
            Home
          </Button>

          <DrawerTrigger asChild>
            <Button variant="ghost" size="sm" className="p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1.5em"
                height="1.5em"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"
                ></path>
              </svg>
            </Button>
          </DrawerTrigger>
        </div>
        
        <DrawerContent className="h-screen top-0 right-0 left-auto mt-0 w-[280px] rounded-l-xl bg-background/80 backdrop-blur-md border-l">
          <ScrollArea className="h-screen">
            <div className="p-4">
              <DrawerHeader className="pb-4 border-b">
                <DrawerTitle>Menu</DrawerTitle>
              </DrawerHeader>
              
              <div className="flex flex-col gap-1 pt-4">
                {/* Products Section */}
                <div className="py-2">
                  <h3 className="px-3 py-2 text-sm font-medium text-muted-foreground">Products</h3>
                  <ul className="space-y-1">
                    {components.map((item) => (
                      <li key={item.title}>
                        <a
                          href={item.href}
                          className="block px-3 py-2 text-sm rounded-lg hover:bg-accent/50 transition-colors"
                        >
                          {item.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Blogs Section */}
                <div className="py-2">
                  <h3 className="px-3 py-2 text-sm font-medium text-muted-foreground">Blogs</h3>
                  <ul className="space-y-1">
                    {blog.map((item) => (
                      <li key={item.title}>
                        <a
                          href={item.href}
                          className="block px-3 py-2 text-sm rounded-lg hover:bg-accent/50 transition-colors"
                        >
                          {item.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Course Section */}
                <div className="py-2">
                  <h3 className="px-3 py-2 text-sm font-medium text-muted-foreground">Course</h3>
                  <ul className="space-y-1">
                    {course.map((item) => (
                      <li key={item.title}>
                        <a
                          href="https://algobrainai.com/#courses"
                          target="_self"
                          className="block px-3 py-2 text-sm rounded-lg hover:bg-accent/50 transition-colors"
                        >
                          {item.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Browse Section */}
                {props.hasBrowseSection == true && (
                  <div className="py-2">
                    <h3 className="px-3 py-2 text-sm font-medium text-muted-foreground">Browse</h3>
                    <ul className="space-y-1">
                      {props.browseItems?.map((e) => (
                        <li key={e.label.toLowerCase().split(" ").join("-")}>
                          <a
                            href={e.href}
                            className="block px-3 py-2 text-sm rounded-lg hover:bg-accent/50 transition-colors"
                          >
                            {e.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    );

  return (
    <NavigationMenu
      className={`w-full flex-none py-2 z-20 fixed top-0 left-0 ${
        isScrolled ? "bg-glass" : ""
      }`}
    >
      <NavigationMenuList className="flex-col md:flex-row items-center gap-2">
        <NavigationMenuItem className="relative">
          <Button variant="light" as="a" href="/">
            Home
          </Button>
        </NavigationMenuItem>
        <NavigationMenuItem className="relative">
          <NavigationMenuTrigger 
            className="bg-transparent hover:bg-accent/50 data-[state=open]:bg-accent/50 px-3 py-2 text-sm">
            Products
          </NavigationMenuTrigger>
          <NavigationMenuContent className="absolute left-0 w-[280px]">
            <ul className="flex flex-col p-4 w-[280px] rounded-xl">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                  className="hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10"
                >
                  {/* {component.description} */}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem className="relative">
          <NavigationMenuTrigger 
            className="bg-transparent hover:bg-accent/50 data-[state=open]:bg-accent/50 px-3 py-2 text-sm">
            Blogs
          </NavigationMenuTrigger>
          <NavigationMenuContent className="absolute left-0 w-[280px]">
            <ul className="flex flex-col p-4 w-[280px] rounded-xl">
              {blog.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                  className="hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10"
                >
                  {/* {component.description} */}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem className="relative">
          <NavigationMenuTrigger 
            className="bg-transparent hover:bg-accent/50 data-[state=open]:bg-accent/50 px-3 py-2 text-sm">
            Course
          </NavigationMenuTrigger>
          <NavigationMenuContent className="absolute left-0 w-[280px]">
            <ul className="flex flex-col p-4 w-[280px] rounded-xl">
              {course.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href="https://algobrainai.com/#courses"
                  target="_self"
                  className="hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10"
                >
                  {/* {component.description} */}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        {props.hasBrowseSection == true && (
          <NavigationMenuItem className="relative">
            <NavigationMenuTrigger 
              className="bg-transparent hover:bg-accent/50 data-[state=open]:bg-accent/50 px-3 py-2 text-sm">
              Browse
            </NavigationMenuTrigger>
            <NavigationMenuContent className="absolute left-0 w-[280px]">
              <ul className="flex flex-col p-4 w-[280px] rounded-xl">
                {props.browseItems?.map((e) => (
                  <ListItem
                    key={e.label.toLowerCase().split(" ").join("-")}
                    title={e.label}
                    href={e.href}
                    className="hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10"
                  >
                    {/* {e.label} */}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li className="w-full">
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none rounded-lg p-3 leading-none no-underline",
            "transition-colors duration-200",
            "hover:bg-accent/50",
            "focus:bg-accent/50 focus:outline-none",
            "active:scale-[0.98]",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          {children && (
            <p className="line-clamp-2 text-xs leading-snug text-muted-foreground mt-1">
              {children}
            </p>
          )}
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
