import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchKey?: string;
  searchPlaceholder?: string;
}

export function DataTable<T extends Record<string, any>>({ columns, data, searchKey, searchPlaceholder }: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const filtered = searchKey
    ? data.filter((item) => String(item[searchKey]).toLowerCase().includes(search.toLowerCase()))
    : data;

  return (
    <div className="space-y-4">
      {searchKey && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder={searchPlaceholder || "Search..."} value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
      )}
      <div className="glass-card rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {columns.map((col) => (
                <TableHead key={col.key} className="text-xs uppercase tracking-wider font-medium text-muted-foreground">{col.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((item, i) => (
              <TableRow key={i} className="hover:bg-muted/50 transition-colors">
                {columns.map((col) => (
                  <TableCell key={col.key}>{col.render ? col.render(item) : item[col.key]}</TableCell>
                ))}
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground">No data found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
