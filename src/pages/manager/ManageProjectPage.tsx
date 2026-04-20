import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  FileText, Download, Eye, Upload, Plus, ChevronLeft, 
  Target, Calendar, Users, Activity, Clock, ShieldCheck, 
  Trash2, FileUp, Briefcase
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { 
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger 
} from "@/components/ui/dialog";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useRole } from "@/contexts/RoleContext";

export default function ManageProjectPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useRole();
  const [project, setProject] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadData, setUploadData] = useState({ name: "", file: null as File | null });

  useEffect(() => {
    // Load project details
    const savedProjects = JSON.parse(localStorage.getItem("app_projects_persistence") || "[]");
    const found = savedProjects.find((p: any) => p.id === id);
    if (found) {
      setProject(found);
    }

    // Load documents
    const loadDocs = () => {
      const savedDocs = JSON.parse(localStorage.getItem("app_documents_persistence") || "[]");
      setDocuments(savedDocs.filter((doc: any) => doc.projectId === id));
    };
    loadDocs();
    window.addEventListener("storage", loadDocs);
    return () => window.removeEventListener("storage", loadDocs);
  }, [id]);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadData.file) return toast.error("No file selected.");

    const newDoc = {
      id: `DOC-${Math.floor(1000 + Math.random() * 9000)}`,
      projectId: id,
      name: uploadData.name || uploadData.file.name,
      fileName: uploadData.file.name,
      uploadedBy: "Manager",
      uploaderName: currentUser.name,
      uploadDate: new Date().toISOString().split('T')[0],
      size: `${(uploadData.file.size / (1024 * 1024)).toFixed(2)} MB`
    };

    const savedDocs = JSON.parse(localStorage.getItem("app_documents_persistence") || "[]");
    const updatedDocs = [newDoc, ...savedDocs];
    localStorage.setItem("app_documents_persistence", JSON.stringify(updatedDocs));
    window.dispatchEvent(new Event("storage"));

    toast.success("Document uploaded successfully.");
    setIsUploadModalOpen(false);
    setUploadData({ name: "", file: null });
  };

  const handleDeleteDoc = (docId: string) => {
    const savedDocs = JSON.parse(localStorage.getItem("app_documents_persistence") || "[]");
    const updatedDocs = savedDocs.filter((d: any) => d.id !== docId);
    localStorage.setItem("app_documents_persistence", JSON.stringify(updatedDocs));
    window.dispatchEvent(new Event("storage"));
    toast.success("Document removed.");
  };

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center shadow-inner">
          <Activity className="h-8 w-8 text-slate-300 animate-pulse" />
        </div>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Project Data Not Found</p>
        <Button variant="ghost" onClick={() => navigate("/manager/projects")} className="text-indigo-600 font-black text-xs uppercase underline">Back to Oversight</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 pt-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-slate-100">
        <div className="space-y-1">
          <Button variant="ghost" size="sm" className="p-0 h-auto hover:bg-transparent text-indigo-600 font-black text-[10px] uppercase tracking-widest mb-2 flex items-center gap-1.5" onClick={() => navigate("/manager/projects")}>
            <ChevronLeft className="h-3 w-3" /> Back to Terminal
          </Button>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-black tracking-tight text-slate-900">{project.name}</h1>
            <Badge className="bg-indigo-600 text-white border-none rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-tighter shadow-sm">{project.status || "Active"}</Badge>
          </div>
          <p className="text-slate-500 font-medium text-sm max-w-2xl">{project.description || "In-depth project management terminal for active operational status."}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="h-10 rounded-xl font-bold text-xs gap-2 border border-slate-200">
            <ShieldCheck className="h-4 w-4" /> Operational
          </Button>
          <Button className="h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 font-black text-xs uppercase tracking-widest gap-2 border-none">
            <Plus className="h-4 w-4" /> New Task
          </Button>
        </div>
      </div>

      {/* Intelligence Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-xl bg-slate-900 text-white rounded-[2rem] overflow-hidden relative group">
           <CardContent className="p-8">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none transition-transform group-hover:scale-110 duration-500">
                <Target size={140} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-2">Project Progress</p>
              <h3 className="text-4xl font-black mb-6">74<span className="text-indigo-400">%</span></h3>
              <Progress value={74} className="h-2 bg-white/10 [&>div]:bg-indigo-500 rounded-full mb-4" />
              <div className="flex justify-between text-[10px] font-black uppercase text-white/50 tracking-widest">
                <span>Phase: Execution</span>
                <span>4/6 Milestones</span>
              </div>
           </CardContent>
        </Card>

        <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden relative group">
           <CardContent className="p-8">
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500">
                <Calendar size={140} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 mb-2">Timeline Pulse</p>
              <h3 className="text-4xl font-black mb-6 text-slate-900">12<span className="text-rose-500 font-medium text-sm ml-1 uppercase">Days Left</span></h3>
              <div className="flex gap-4">
                 <div className="flex flex-col">
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Started</span>
                   <span className="text-xs font-bold text-slate-900">{project.startDate || '2026-01-12'}</span>
                 </div>
                 <div className="h-8 w-px bg-slate-100 mx-2" />
                 <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Deadline</span>
                    <span className="text-xs font-bold text-rose-600">{project.deadline || '2026-07-23'}</span>
                 </div>
              </div>
           </CardContent>
        </Card>

        <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden relative group">
           <CardContent className="p-8">
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500">
                <Users size={140} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 mb-2">Team Capacity</p>
              <h3 className="text-4xl font-black mb-6 text-slate-900">08<span className="text-emerald-500 font-medium text-sm ml-1 uppercase">Allocated</span></h3>
              <div className="flex -space-x-2">
                 {[1,2,3,4,5].map(i => (
                   <div key={i} className="h-8 w-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-black text-slate-400 uppercase tracking-tight italic">
                     {String.fromCharCode(64+i)}
                   </div>
                 ))}
                 <div className="h-8 w-8 rounded-full bg-slate-50 border-2 border-white flex items-center justify-center text-[8px] font-black text-slate-400">
                   +3
                 </div>
              </div>
           </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 gap-8">
        {/* Project Documents Section */}
        <section className="space-y-6">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="h-10 w-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
                    <FileText className="h-5 w-5" />
                 </div>
                 <div>
                    <h2 className="text-xl font-bold tracking-tight text-slate-900">Project Documents</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Centralized tactical assets repository</p>
                 </div>
              </div>
              
              <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
                <DialogTrigger asChild>
                  <Button className="h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 font-black text-xs uppercase tracking-widest gap-2 border-none">
                    <Upload className="h-4 w-4" /> Upload Document
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[480px] rounded-[2rem] p-0 border-none shadow-2xl overflow-hidden bg-white">
                  <DialogHeader className="p-8 bg-indigo-600 text-white relative">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                      <FileUp size={120} />
                    </div>
                    <DialogTitle className="text-xl font-bold flex items-center gap-3"><FileUp className="h-5 w-5" /> Ingest Asset</DialogTitle>
                    <DialogDescription className="text-indigo-100/70 font-medium mt-1">Upload a document to link it to the {project.name} lifecycle.</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleUpload} className="p-8 space-y-6">
                    <div className="space-y-4">
                       <div className="space-y-2">
                          <Label htmlFor="docName" className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Document Label</Label>
                          <Input 
                            id="docName" 
                            placeholder="e.g. Technical Specification" 
                            className="h-12 rounded-xl border-slate-100 bg-slate-50/50 font-bold text-sm focus-visible:ring-indigo-600/20"
                            value={uploadData.name}
                            onChange={e => setUploadData(prev => ({ ...prev, name: e.target.value }))}
                          />
                       </div>
                       <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Source File</Label>
                          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 transition-all hover:bg-slate-50 hover:border-indigo-300 group cursor-pointer relative overflow-hidden text-center">
                            <input 
                              type="file" 
                              className="absolute inset-0 opacity-0 cursor-pointer" 
                              onChange={e => setUploadData(prev => ({ ...prev, file: e.target.files?.[0] || null }))}
                            />
                            <div className="h-12 w-12 rounded-full bg-slate-100 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 flex items-center justify-center transition-colors mx-auto mb-3">
                               <Upload className="h-6 w-6" />
                            </div>
                            <p className="text-xs font-bold text-slate-700">{uploadData.file ? uploadData.file.name : "Select binary stream"}</p>
                            <p className="text-[9px] font-medium text-slate-400 mt-1 uppercase tracking-tighter">MAX 20MB • PDF, DOCX, XLSX</p>
                          </div>
                       </div>
                    </div>
                    <DialogFooter className="pt-2">
                       <Button type="button" variant="ghost" className="h-12 font-bold text-xs uppercase rounded-xl" onClick={() => setIsUploadModalOpen(false)}>Cancel</Button>
                       <Button type="submit" className="h-12 px-8 bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-600/10 rounded-xl font-black text-xs uppercase border-none transition-all active:scale-95">Initiate Upload</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
           </div>

           <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden min-h-[300px]">
              {documents.length === 0 ? (
                <div className="h-[300px] flex flex-col items-center justify-center space-y-4 text-center">
                   <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 shadow-inner">
                      <Briefcase className="h-8 w-8 text-slate-200" />
                   </div>
                   <div className="space-y-1">
                      <p className="text-sm font-bold text-slate-400 italic font-serif">Awaiting asset deployment...</p>
                      <p className="text-[9px] font-black uppercase text-slate-300 tracking-widest">No documents uploaded to this repository yet.</p>
                   </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                      <thead className="bg-slate-50/50 border-b border-slate-100">
                         <tr>
                            <th className="py-4 px-8 text-[9px] font-black uppercase tracking-widest text-slate-400">File Reference</th>
                            <th className="py-4 px-6 text-[9px] font-black uppercase tracking-widest text-slate-400">Uploader Auth</th>
                            <th className="py-4 px-6 text-[9px] font-black uppercase tracking-widest text-slate-400">Deployed At</th>
                            <th className="py-4 px-8 text-[9px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                         {documents.map((doc) => (
                           <motion.tr 
                             key={doc.id}
                             initial={{ opacity: 0 }}
                             animate={{ opacity: 1 }}
                             className="group hover:bg-slate-50/80 transition-all"
                           >
                              <td className="py-5 px-8">
                                 <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 transition-all group-hover:bg-indigo-600 group-hover:text-white group-hover:scale-110 shadow-sm">
                                       <FileText className="h-5 w-5" />
                                    </div>
                                    <div className="flex flex-col">
                                       <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase italic tracking-tight">{doc.name}</span>
                                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mt-0.5">{doc.fileName} • {doc.size}</span>
                                    </div>
                                 </div>
                              </td>
                              <td className="py-5 px-6">
                                 <Badge className="bg-slate-100 text-slate-600 border-none text-[8px] px-2 h-5 font-black uppercase tracking-tighter rounded-md">
                                    {doc.uploaderName || doc.uploadedBy}
                                 </Badge>
                              </td>
                              <td className="py-5 px-6">
                                 <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                                    <Clock className="h-3 w-3 text-slate-300" /> {doc.uploadDate}
                                 </div>
                              </td>
                              <td className="py-5 px-8 text-right">
                                 <div className="flex items-center justify-end gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all" onClick={() => toast.info(`Viewing ${doc.fileName}...`)}>
                                       <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-all" onClick={() => toast.success(`Downloading ${doc.fileName}...`)}>
                                       <Download className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-all" onClick={() => handleDeleteDoc(doc.id)}>
                                       <Trash2 className="h-4 w-4" />
                                    </Button>
                                 </div>
                              </td>
                           </motion.tr>
                         ))}
                      </tbody>
                   </table>
                </div>
              )}
           </div>
        </section>
      </div>
    </div>
  );
}
