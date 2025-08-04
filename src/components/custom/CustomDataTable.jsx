"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/**
 * @typedef Column
 * @property {string} key - Field key in data row.
 * @property {string} label - Column label to display.
 * @property {(value: any, row: any) => React.ReactNode} [render] - Optional custom cell renderer.
 */

/**
 * Reusable table component.
 * @param {{
 *  columns: Column[];
 *  data: Record<string, any>[];
 *  title?: string;
 *  description?: string;
 * }} props
 */
const DataTable = ({ columns, data, title, description }) => {
  return (
    <div className="w-full h-full">
      {(title || description) && (
        <div className="mb-4">
          {title && <h2 className="text-xl font-bold">{title}</h2>}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}

      <div className="border rounded-md overflow-auto">
        <div className="min-w-[1200px]">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10 border-b">
              <TableRow>
                {columns.map((col) => (
                  <TableHead
                    key={col.key}
                    className="whitespace-nowrap font-semibold text-xs bg-muted/50 min-w-[120px] px-3 py-2"
                  >
                    {col.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, idx) => (
                <TableRow key={idx} className="hover:bg-muted/30">
                  {columns.map((col) => (
                    <TableCell
                      key={col.key}
                      className="whitespace-nowrap text-xs py-3 px-3 min-w-[120px]"
                    >
                      {col.render
                        ? col.render(row[col.key], row)
                        : row[col.key] || "-"}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
