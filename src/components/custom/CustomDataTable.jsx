"use client";
import React, { useState, useMemo, useCallback } from "react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Filter,
  Download,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  FileText,
  BarChart3,
  Users,
  Settings,
  Database,
  Grid3X3,
  List,
  Activity,
  Gift,
  MoreHorizontal,
  X,
} from "lucide-react";

// Extract TableControls as a separate component to prevent re-creation
const TableControls = React.memo(
  ({
    cols,
    filename,
    globalFilter,
    setGlobalFilter,
    processedData,
    exportToCSV,
  }) => (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4 p-4 bg-muted/30 rounded-lg">
      <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search all columns..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-10 w-64"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => exportToCSV(processedData, cols, filename)}
        >
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
        <Badge variant="outline" className="text-xs">
          {processedData.length} records
        </Badge>
      </div>
    </div>
  )
);

TableControls.displayName = "TableControls";

/**
 * Enhanced DataTable with search, filter, sort, and pagination
 */
const DataTable = ({
  columns = [],
  data = [],
  title,
  description,
  isTabs = false,
  tabs = [],
}) => {
  // State management - separate for each tab
  const [activeTab, setActiveTab] = useState(
    tabs.length > 0 ? tabs[0].tabName : ""
  );
  const [globalFilter, setGlobalFilter] = useState("");

  const [sorting, setSorting] = useState({ column: null, direction: null });
  const [pagination, setPagination] = useState({ page: 0, pageSize: 10 });

  // Get current tab data
  const getCurrentTabData = () => {
    if (!isTabs || !tabs.length) return { columns, data };
    const currentTab = tabs.find((tab) => tab.tabName === activeTab);
    return {
      columns: currentTab?.columns || [],
      data: currentTab?.data || [],
    };
  };

  const { columns: currentColumns, data: currentData } = getCurrentTabData();

  // Icon mapping for tabs
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
        gift: Gift,
      };
      const IconComponent = iconMap[customIcon] || FileText;
      return <IconComponent className="w-4 h-4" />;
    }
    // Auto-assign icons based on tab name
    const name = tabName.toLowerCase();
    if (name.includes("gift")) return <Gift className="w-4 h-4" />;
    if (
      name.includes("user") ||
      name.includes("member") ||
      name.includes("people")
    )
      return <Users className="w-4 h-4" />;
    if (
      name.includes("chart") ||
      name.includes("analytics") ||
      name.includes("report")
    )
      return <BarChart3 className="w-4 h-4" />;
    if (name.includes("setting") || name.includes("config"))
      return <Settings className="w-4 h-4" />;
    if (name.includes("data") || name.includes("record"))
      return <Database className="w-4 h-4" />;
    if (name.includes("activity") || name.includes("log"))
      return <Activity className="w-4 h-4" />;
    if (name.includes("point")) return <BarChart3 className="w-4 h-4" />;
    if (name.includes("bill")) return <FileText className="w-4 h-4" />;
    if (name.includes("value")) return <Users className="w-4 h-4" />;
    return <Grid3X3 className="w-4 h-4" />;
  };

  // Data processing with filters, search, and sorting
  const processedData = useMemo(() => {
    let filtered = [...currentData];
    // Apply global search
    if (globalFilter) {
      filtered = filtered.filter((row) =>
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(globalFilter.toLowerCase())
        )
      );
    }
    // Apply column filters

    // Apply sorting
    if (sorting.column) {
      filtered.sort((a, b) => {
        const aVal = a[sorting.column];
        const bVal = b[sorting.column];
        // Handle currency values
        const getNumericValue = (val) => {
          if (typeof val === "string" && val.includes("₹")) {
            return Number.parseFloat(val.replace(/₹|,/g, ""));
          }
          return val;
        };
        const aNum = getNumericValue(aVal);
        const bNum = getNumericValue(bVal);
        if (aNum < bNum) return sorting.direction === "asc" ? -1 : 1;
        if (aNum > bNum) return sorting.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [currentData, globalFilter, sorting]);

  // Pagination
  const paginatedData = useMemo(() => {
    const start = pagination.page * pagination.pageSize;
    return processedData.slice(start, start + pagination.pageSize);
  }, [processedData, pagination]);

  const totalPages = Math.ceil(processedData.length / pagination.pageSize);

  // Reset filters when tab changes
  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    setGlobalFilter("");
    setSorting({ column: null, direction: null });
    setPagination({ page: 0, pageSize: 10 });
  };

  // Export to CSV
  const exportToCSV = useCallback(
    (exportData, exportColumns, filename = "data") => {
      const headers = exportColumns.map((col) => col.label).join(",");
      const rows = exportData
        .map((row) =>
          exportColumns.map((col) => `"${row[col.key] || ""}"`).join(",")
        )
        .join("\n");
      const csv = `${headers}\n${rows}`;
      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${filename}.csv`;
      a.click();
    },
    []
  );

  // Enhanced cell renderer with type detection
  const renderCellValue = (value, column) => {
    if (!value || value === "-")
      return <span className="text-muted-foreground">-</span>;
    // Currency formatting
    if (typeof value === "string" && value.includes("₹")) {
      return <span className="font-medium text-green-600">{value}</span>;
    }
    // Date formatting
    if (column.key.toLowerCase().includes("date") && value !== "-") {
      return <span className="text-blue-600">{value}</span>;
    }
    // Status badges
    if (column.key.toLowerCase().includes("status")) {
      const getStatusVariant = (status) => {
        const s = status.toLowerCase();
        if (
          s.includes("approved") ||
          s.includes("completed") ||
          s.includes("success")
        )
          return "default";
        if (s.includes("pending") || s.includes("draft")) return "secondary";
        if (
          s.includes("rejected") ||
          s.includes("failed") ||
          s.includes("error")
        )
          return "destructive";
        return "outline";
      };
      return (
        <Badge variant={getStatusVariant(value)} className="text-xs">
          {value}
        </Badge>
      );
    }
    // Code formatting
    if (
      column.key.toLowerCase().includes("code") ||
      column.key.toLowerCase().includes("number")
    ) {
      return (
        <code className="text-xs bg-muted px-1 py-0.5 rounded">{value}</code>
      );
    }
    return value;
  };

  // Enhanced table renderer
  const renderTable = useCallback(
    (cols, filename = "data") => (
      <div className="space-y-4">
        <TableControls
          cols={cols}
          filename={filename}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          processedData={processedData}
          exportToCSV={exportToCSV}
        />
        <div className="border rounded-lg overflow-hidden shadow-sm bg-card">
          <div className="overflow-auto max-h-[600px]">
            <Table>
              <TableHeader className="sticky top-0 bg-muted/50 backdrop-blur-sm z-10">
                <TableRow className="border-b border-border/50">
                  {cols.map((col) => (
                    <TableHead
                      key={col.key}
                      className="whitespace-nowrap font-semibold text-sm text-foreground/80 min-w-[140px] px-4 py-3 first:pl-6 last:pr-6"
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 font-semibold hover:bg-transparent"
                        onClick={() => {
                          setSorting((prev) => ({
                            column: col.key,
                            direction:
                              prev.column === col.key &&
                              prev.direction === "asc"
                                ? "desc"
                                : "asc",
                          }));
                          setPagination((prev) => ({ ...prev, page: 0 }));
                        }}
                      >
                        {col.label}
                        {sorting.column === col.key ? (
                          sorting.direction === "asc" ? (
                            <ArrowUp className="w-4 h-4 ml-1" />
                          ) : (
                            <ArrowDown className="w-4 h-4 ml-1" />
                          )
                        ) : (
                          <ArrowUpDown className="w-4 h-4 ml-1 opacity-40" />
                        )}
                      </Button>
                    </TableHead>
                  ))}
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((row, idx) => (
                    <TableRow
                      key={idx}
                      className="hover:bg-muted/20 transition-colors duration-150 border-b border-border/30 last:border-b-0"
                    >
                      {cols.map((col) => (
                        <TableCell
                          key={col.key}
                          className="whitespace-nowrap text-sm py-3 px-4 min-w-[140px] first:pl-6 last:pr-6 text-foreground/90"
                        >
                          {col.render
                            ? col.render(row[col.key], row)
                            : renderCellValue(row[col.key], col)}
                        </TableCell>
                      ))}
                      <TableCell className="w-12 pr-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Copy ID</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={cols.length + 1}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Rows per page:
            </span>
            <Select
              value={pagination.pageSize.toString()}
              onValueChange={(value) =>
                setPagination((prev) => ({
                  ...prev,
                  pageSize: Number.parseInt(value),
                  page: 0,
                }))
              }
            >
              <SelectTrigger className="w-20 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 20, 50].map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Showing{" "}
              {Math.min(
                pagination.page * pagination.pageSize + 1,
                processedData.length
              )}{" "}
              to{" "}
              {Math.min(
                (pagination.page + 1) * pagination.pageSize,
                processedData.length
              )}{" "}
              of {processedData.length} results
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPagination((prev) => ({ ...prev, page: 0 }))}
              disabled={pagination.page === 0}
            >
              <ChevronsLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
              }
              disabled={pagination.page === 0}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm px-2">
              Page {pagination.page + 1} of {Math.max(1, totalPages)}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
              }
              disabled={pagination.page >= totalPages - 1}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: totalPages - 1 }))
              }
              disabled={pagination.page >= totalPages - 1}
            >
              <ChevronsRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    ),
    [
      globalFilter,
      setGlobalFilter,
      processedData,
      exportToCSV,
      paginatedData,
      sorting,
      pagination,
      setSorting,
      setPagination,
      totalPages,
    ]
  );

  return (
    <div className="w-full space-y-6">
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
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <div className="border-b border-border/40 bg-gradient-to-r from-muted/30 to-muted/10 rounded-t-lg px-2 py-2">
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
                    data-[state=active]:shadow-md
                    data-[state=active]:scale-105
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
                {renderTable(
                  tab.columns || [],
                  tab.tabName.toLowerCase().replace(/\s+/g, "_")
                )}
              </TabsContent>
            ))}
          </div>
        </Tabs>
      ) : (
        currentColumns && currentData && renderTable(currentColumns, "data")
      )}
    </div>
  );
};

export default DataTable;
