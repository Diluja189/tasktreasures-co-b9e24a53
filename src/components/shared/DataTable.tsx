import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronLeft, ChevronRight, Download, Filter, SlidersHorizontal } from "lucide-react";
import { useState, useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchKey?: string;
  searchPlaceholder?: string;
  pageSize?: number;
  filterOptions?: { key: string; label: string; options: string[] }[];
  exportable?: boolean;
  bulkActions?: boolean;
  title?: string;
}

export function DataTable<T extends Record<string, any>>({
  columns, data, searchKey, searchPlaceholder, pageSize = 10,
  filterOptions, exportable = false, bulkActions = false, title,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  const filtered = useMemo(() => {
    let result = data;
    if (searchKey && search) {
      result = result.filter((item) => String(item[searchKey]).toLowerCase().includes(search.toLowerCase()));
    }
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "all") {
        result = result.filter((item) => String(item[key]) === value);
      }
    });
    if (sortKey) {
      result = [...result].sort((a, b) => {
        const aVal = a[sortKey], bVal = b[sortKey];
        const cmp = typeof aVal === "number" ? aVal - bVal : String(aVal).localeCompare(String(bVal));
        return sortDir === "asc" ? cmp : -cmp;
      });
    }
    return result;
  }, [data, search, searchKey, filters, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice(page * pageSize, (page + 1) * pageSize);

  const toggleSort = (key: string) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const toggleRow = (i: number) => {
    const next = new Set(selectedRows);
    next.has(i) ? next.delete(i) : next.add(i);
    setSelectedRows(next);
  };

  const toggleAll = () => {
    if (selectedRows.size === paginated.length) setSelectedRows(new Set());
    else setSelectedRows(new Set(paginated.map((_, i) => i)));
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1">
          {searchKey && (
            <div className="relative max-w-xs flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder={searchPlaceholder || "Search..."} value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} className="pl-9 h-9" />
            </div>
          )}
          {filterOptions?.map((f) => (
            <Select key={f.key} value={filters[f.key] || "all"} onValueChange={(v) => { setFilters({ ...filters, [f.key]: v }); setPage(0); }}>
              <SelectTrigger className="w-[130px] h-9 text-xs">
                <SelectValue placeholder={f.label} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All {f.label}</SelectItem>
                {f.options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {selectedRows.size > 0 && (
            <Badge variant="outline" className="text-xs">{selectedRows.size} selected</Badge>
          )}
          {exportable && (
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
              <Download className="h-3.5 w-3.5" /> Export
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {bulkActions && (
                <TableHead className="w-10">
                  <input type="checkbox" checked={selectedRows.size === paginated.length && paginated.length > 0} onChange={toggleAll} className="rounded border-border" />
                </TableHead>
              )}
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className={`text-xs uppercase tracking-wider font-semibold text-muted-foreground ${col.sortable !== false ? 'cursor-pointer hover:text-foreground select-none' : ''}`}
                  onClick={() => col.sortable !== false && toggleSort(col.key)}
                >
                  <span className="flex items-center gap-1">
                    {col.label}
                    {sortKey === col.key && (
                      <span className="text-primary">{sortDir === "asc" ? "↑" : "↓"}</span>
                    )}
                  </span>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((item, i) => (
              <TableRow key={i} className={`hover:bg-muted/50 transition-colors ${selectedRows.has(i) ? 'bg-primary/5' : ''}`}>
                {bulkActions && (
                  <TableCell>
                    <input type="checkbox" checked={selectedRows.has(i)} onChange={() => toggleRow(i)} className="rounded border-border" />
                  </TableCell>
                )}
                {columns.map((col) => (
                  <TableCell key={col.key}>{col.render ? col.render(item) : item[col.key]}</TableCell>
                ))}
              </TableRow>
            ))}
            {paginated.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length + (bulkActions ? 1 : 0)} className="text-center py-12">
                  <div className="flex flex-col items-center gap-2">
                    <Search className="h-8 w-8 text-muted-foreground/40" />
                    <p className="text-sm text-muted-foreground">No results found</p>
                    <p className="text-xs text-muted-foreground/70">Try adjusting your search or filters</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Showing {page * pageSize + 1}-{Math.min((page + 1) * pageSize, filtered.length)} of {filtered.length}</span>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)} className="h-7 w-7 p-0">
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => (
              <Button key={i} variant={page === i ? "default" : "outline"} size="sm" onClick={() => setPage(i)} className="h-7 w-7 p-0 text-xs">
                {i + 1}
              </Button>
            ))}
            <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)} className="h-7 w-7 p-0">
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
