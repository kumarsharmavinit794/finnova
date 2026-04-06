import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Shield, Bell, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function SettingsPage() {
  const { logout } = useAuth();
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>

      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <User className="h-5 w-5 text-muted-foreground" />
            <h2 className="font-semibold text-foreground">Profile</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm text-muted-foreground">Full Name</label>
              <Input defaultValue="Bindu" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm text-muted-foreground">Email</label>
              <Input defaultValue="rohit@cloudstacklabs.com" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm text-muted-foreground">Business Name</label>
              <Input defaultValue="CloudStack Labs LLP" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm text-muted-foreground">GSTIN</label>
              <Input defaultValue="29AADFC3540K1ZS" />
            </div>
          </div>
          <Button variant="default" size="sm" className="mt-4">Save Changes</Button>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-5 w-5 text-muted-foreground" />
            <h2 className="font-semibold text-foreground">Change Password</h2>
          </div>
          <div className="space-y-4 max-w-sm">
            <div className="space-y-1.5">
              <label className="text-sm text-muted-foreground">Current Password</label>
              <Input type="password" placeholder="••••••••" value={oldPw} onChange={(e) => setOldPw(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm text-muted-foreground">New Password</label>
              <Input type="password" placeholder="••••••••" value={newPw} onChange={(e) => setNewPw(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm text-muted-foreground">Confirm New Password</label>
              <Input type="password" placeholder="••••••••" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} />
            </div>
            <Button variant="default" size="sm">Update Password</Button>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <h2 className="font-semibold text-foreground">Notifications</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Email notifications</p>
                <p className="text-xs text-muted-foreground">Get notified about filing deadlines</p>
              </div>
              <Button variant="outline" size="sm">Enabled</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">SMS alerts</p>
                <p className="text-xs text-muted-foreground">Receive critical compliance alerts</p>
              </div>
              <Button variant="outline" size="sm">Enable</Button>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-destructive/20 bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-foreground">Sign out</p>
              <p className="text-sm text-muted-foreground">Log out of your TaxMind account</p>
            </div>
            <Link to="/login">
              <Button variant="destructive" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />Sign Out
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
