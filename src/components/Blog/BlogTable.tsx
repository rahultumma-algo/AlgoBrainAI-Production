import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/table";
type TableData = Array<Array<string>>;

export default function BlogTable({ tableData }: { tableData: TableData }) {
  return (
    <Table
      classNames={{ thead: "[&>tr:last-child]:!mt-0 [&>tr:last-child]:!h-0" }}
      aria-label="Dynamic collection table"
    >
      <TableHeader>
        {tableData[0].map((header, index) => (
          <TableColumn
            className={tableData[0].length == 2 && index == 0 ? "w-[50%]" : ""}
            key={index}
          >
            {header}
          </TableColumn>
        ))}
      </TableHeader>
      <TableBody>
        {tableData.slice(1).map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <TableCell key={cellIndex}>{cell}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
