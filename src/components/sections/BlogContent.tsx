import { Tabs, Tab } from "@nextui-org/tabs";

//@ts-ignore
function BlogContent(prop) {
  return (
    // @ts-ignore
    <Tabs
      classNames={{
        base: "w-[75%] mx-auto block mt-5",
        tab: "p-6 w-full",
        tabContent: "",
        panel: "w-[85%] mx-auto mt-5",
      }}
      size="lg"
      radius="full"
      aria-label="Options"
    >
      <Tab key="overview" title="Overview">
        {prop.content}
      </Tab>
      <Tab key="resources" title="Resources">
        {prop.resources}
      </Tab>
    </Tabs>
  );
}

export default BlogContent;
