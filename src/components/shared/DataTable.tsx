import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, Filter, AlertCircle } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
    <div className="space-y-6">
      {searchKey && (
        <div className="flex items-center gap-3">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder={searchPlaceholder || "Search..."} 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="pl-10 h-10 border-none bg-card/50 shadow-sm focus-visible:ring-primary/20 transition-all rounded-xl" 
            />
          </div>
          <button className="h-10 px-3 bg-card/50 border-none shadow-sm rounded-xl text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span className="text-xs font-semibold hidden sm:inline">Advanced Filters</span>
          </button>
        </div>
      )}
      <div className="border border-border/50 rounded-2xl overflow-hidden shadow-sm bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent bg-muted/20 border-b border-border/50">
              {columns.map((col) => (
                <TableHead key={col.key} className="h-12 text-[10px] uppercase tracking-widest font-bold text-muted-foreground px-6">{col.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="popLayout">
              {filtered.map((item, i) => (
                <TableRow 
                  key={i} 
                  className="hover:bg-muted/10 transition-colors border-b border-border/50 last:border-0 group"
                >
                  {columns.map((col) => (
                    <TableCell key={col.key} className="px-6 py-4">
                      {col.render ? col.render(item) : (
                        <span className="text-sm font-medium text-foreground">{item[col.key]}</span>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </AnimatePresence>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-[300px] text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground space-y-3">
                    <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center">
                      <AlertCircle className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">No matches found</p>
                      <p className="text-xs">Try adjusting your search or filters</p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
