import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Image, File } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const files = [
  { name: "design-specs.pdf", size: "2.4 MB", uploaded: "Jun 25", project: "E-Commerce Platform", type: "pdf" },
  { name: "wireframes-v2.fig", size: "8.1 MB", uploaded: "Jun 24", project: "Mobile App v3.0", type: "file" },
  { name: "api-docs.md", size: "156 KB", uploaded: "Jun 23", project: "Data Pipeline", type: "doc" },
  { name: "screenshot-home.png", size: "1.8 MB", uploaded: "Jun 22", project: "E-Commerce Platform", type: "image" },
];

const typeIcons: Record<string, any> = { pdf: FileText, doc: FileText, image: Image, file: File };

const FilesPage = () => (
  <div className="space-y-6">
    <PageHeader title="My Files" description="Manage your deliverables and attachments" actions={<Button size="sm"><Upload className="h-4 w-4 mr-1" /> Upload</Button>} />
    <div className="glass-card rounded-xl divide-y divide-border">
      {files.map((f, i) => {
        const Icon = typeIcons[f.type] || File;
        return (
          <div key={i} className="flex items-center gap-4 p-4">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"><Icon className="h-5 w-5 text-primary" /></div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{f.name}</p>
              <p className="text-xs text-muted-foreground">{f.project} · {f.uploaded}</p>
            </div>
            <span className="text-xs text-muted-foreground">{f.size}</span>
          </div>
        );
      })}
    </div>
  </div>
);

export default FilesPage;
