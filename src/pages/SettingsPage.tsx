import { PageHeader } from "@/components/shared/PageHeader";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const SettingsPage = () => (
  <div className="space-y-6">
    <PageHeader title="Settings" description="System configuration and preferences" />
    <div className="space-y-6 max-w-2xl">
      <div className="glass-card rounded-xl p-5 space-y-4">
        <h3 className="font-display font-semibold text-sm">General</h3>
        <div className="space-y-3">
          <div className="space-y-1.5"><Label className="text-xs">Company Name</Label><Input defaultValue="Acme Corp" className="h-9" /></div>
          <div className="space-y-1.5"><Label className="text-xs">Admin Email</Label><Input defaultValue="admin@acme.com" className="h-9" /></div>
        </div>
      </div>
      <div className="glass-card rounded-xl p-5 space-y-4">
        <h3 className="font-display font-semibold text-sm">Notifications</h3>
        <div className="space-y-3">
          {["Email notifications", "Push notifications", "Deadline reminders", "Weekly digest"].map((s) => (
            <div key={s} className="flex items-center justify-between">
              <Label className="text-sm">{s}</Label>
              <Switch defaultChecked />
            </div>
          ))}
        </div>
      </div>
      <div className="glass-card rounded-xl p-5 space-y-4">
        <h3 className="font-display font-semibold text-sm">Security</h3>
        <div className="space-y-3">
          {["Two-factor authentication", "Session timeout (30 min)", "Login audit logging"].map((s) => (
            <div key={s} className="flex items-center justify-between">
              <Label className="text-sm">{s}</Label>
              <Switch defaultChecked />
            </div>
          ))}
        </div>
      </div>
      <Button>Save Changes</Button>
    </div>
  </div>
);

export default SettingsPage;
