"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  BarChart3,
  Users,
  Settings,
  Database,
  Grid3X3,
  List,
  Activity,
} from "lucide-react";

/**
 * @typedef Column
 * @property {string} key - Field key in data row.
 * @property {string} label - Column label to display.
 * @property {(value: any, row: any) => React.ReactNode} [render] - Optional custom cell renderer.
 */

/**
 * Reusable table component with optional tabs.
 * @param {{
 *  columns?: Column[];
 *  data?: Record<string, any>[];
 *  title?: string;
 *  description?: string;
 *  isTabs?: boolean;
 *  tabs?: { tabName: string; columns: Column[]; data: Record<string, any>[]; icon?: string }[];
 * }} props
 */
const DataTable = ({
  columns,
  data,
  title,
  description,
  isTabs = false,
  tabs = [],
}) => {
  // Icon mapping for different tab types
  const getTabIcon = (tabName, customIcon) => {
    if (customIcon) {
      const iconMap = {
        file: FileText,
        chart: BarChart3,
        users: Users,
        settings: Settings,
        database: Database,
        grid: Grid3X3,
        list: List,
        activity: Activity,
      };
      const IconComponent = iconMap[customIcon] || FileText;
      return <IconComponent className="w-4 h-4" />;
    }

    // Auto-assign icons based on tab name
    const name = tabName.toLowerCase();
    if (
      name.includes("user") ||
      name.includes("member") ||
      name.includes("people")
    ) {
      return <Users className="w-4 h-4" />;
    }
    if (
      name.includes("chart") ||
      name.includes("analytics") ||
      name.includes("report")
    ) {
      return <BarChart3 className="w-4 h-4" />;
    }
    if (name.includes("setting") || name.includes("config")) {
      return <Settings className="w-4 h-4" />;
    }
    if (name.includes("data") || name.includes("record")) {
      return <Database className="w-4 h-4" />;
    }
    if (name.includes("activity") || name.includes("log")) {
      return <Activity className="w-4 h-4" />;
    }
    return <Grid3X3 className="w-4 h-4" />;
  };

  const renderTable = (cols, rows) => (
    <div className="border rounded-lg overflow-hidden shadow-sm bg-card">
      <div className="overflow-auto">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="border-b border-border/50">
              {cols.map((col) => (
                <TableHead
                  key={col.key}
                  className="whitespace-nowrap font-semibold text-sm text-foreground/80 min-w-[120px] px-4 py-3 first:pl-6 last:pr-6"
                >
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, idx) => (
              <TableRow
                key={idx}
                className="hover:bg-muted/20 transition-colors duration-150 border-b border-border/30 last:border-b-0"
              >
                {cols.map((col) => (
                  <TableCell
                    key={col.key}
                    className="whitespace-nowrap text-sm py-3 px-4 min-w-[120px] first:pl-6 last:pr-6 text-foreground/90"
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
  );

  return (
    <div className="w-full h-full space-y-6">
      {(title || description) && (
        <div className="space-y-2">
          {title && (
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
          )}
        </div>
      )}

      {isTabs && Array.isArray(tabs) && tabs.length > 0 ? (
        <Tabs defaultValue={tabs[0].tabName} className="w-full">
          <div className="border-b border-border/40 bg-muted/20 rounded-t-lg px-1 py-1">
            <TabsList className="bg-transparent h-auto p-0 space-x-1">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.tabName}
                  value={tab.tabName}
                  className="
                    relative px-4 py-2.5 rounded-md text-sm font-medium
                    transition-all duration-200 ease-in-out
                    data-[state=active]:bg-background 
                    data-[state=active]:text-foreground
                    data-[state=active]:shadow-sm
                    data-[state=inactive]:text-muted-foreground
                    data-[state=inactive]:hover:text-foreground/80
                    data-[state=inactive]:hover:bg-muted/40
                    flex items-center gap-2
                    border border-transparent
                    data-[state=active]:border-border/50
                  "
                >
                  {getTabIcon(tab.tabName, tab.icon)}
                  <span className="font-medium">{tab.tabName}</span>
                  <Badge
                    variant="secondary"
                    className="
                      ml-1 px-2 py-0.5 text-xs font-medium
                      bg-muted-foreground/10 text-muted-foreground
                      data-[state=active]:bg-primary/10 
                      data-[state=active]:text-primary
                      border-0
                    "
                  >
                    {tab.data?.length || 0}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div className="mt-6">
            {tabs.map((tab) => (
              <TabsContent
                key={tab.tabName}
                value={tab.tabName}
                className="mt-0 focus-visible:outline-none"
              >
                {renderTable(tab.columns, tab.data)}
              </TabsContent>
            ))}
          </div>
        </Tabs>
      ) : (
        columns && data && renderTable(columns, data)
      )}
    </div>
  );
};

export default DataTable;
