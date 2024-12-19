import React from "react";
import type { Key } from "react";
import { Tabs, Tab } from "@nextui-org/tabs";

function Filter({
  categories,
  setFilters,
}: {
  categories: string[];
  filters: string;
  setFilters: React.Dispatch<React.SetStateAction<string>>;
}) {
  const handleSelectionChange = (key: string) => {
    setFilters(key);
  };

  return (
    <div className="flex w-full flex-col">
           {/* @ts-ignore */}

      <Tabs
        classNames={{
          tabList: "mx-auto text-center",
        }}
        aria-label="Product Categories"
        onSelectionChange={(key: Key) => handleSelectionChange(key.toString())}
      >
        <>
          <Tab key="all" title="All"></Tab>
          {categories.map((category) => (
            <Tab key={category} title={category}></Tab>
          ))}
        </>
      </Tabs>
    </div>
  );
}

export default Filter;
