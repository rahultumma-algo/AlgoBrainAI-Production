import { Card, CardHeader, CardBody } from "@nextui-org/card";
import type { Section } from "@/lib/types";

function BlogTOC({ contents }: { contents: Section[] }) {
  return (
    <Card className="sticky top-4">
      <CardHeader className="border-b border-divider">
        <p className="text-lg font-semibold">On this page</p>
      </CardHeader>
      <CardBody>
        <ul className="flex flex-col gap-2">
          {contents.map((section) => (
            <li key={section.section_title}>
              <a
                title={section.section_title}
                aria-label={section.section_title}
                href={"#" + section.section_title}
                className="text-foreground/70 hover:text-foreground transition-colors duration-200 block py-1 px-2 rounded hover:bg-foreground/10"
              >
                {section.section_title}
              </a>
            </li>
          ))}
        </ul>
      </CardBody>
    </Card>
  );
}

export default BlogTOC;
