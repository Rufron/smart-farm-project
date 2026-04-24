import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings as SettingsIcon, User, Bell, Shield, LogOut } from "lucide-react";
import { useRole } from "@/components/RoleContext";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const { user, logout } = useRole();
  const nav = useNavigate();

  const handleLogout = () => {
    logout();
    nav("/login");
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-3xl mx-auto animate-fade-up">
        <div>
          <h1 className="font-display text-3xl font-semibold flex items-center gap-2">
            <SettingsIcon className="h-8 w-8 text-primary" /> Settings
          </h1>
          <p className="text-muted-foreground mt-1">Manage your account and system preferences.</p>
        </div>

        <div className="grid gap-6">
          <Card className="border-border/60 shadow-soft">
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Profile Information</CardTitle>
              </div>
              <CardDescription>Your personal account details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={user?.name || ""} readOnly className="bg-muted/30" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" value={user?.email || ""} readOnly className="bg-muted/30" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <div className="flex items-center gap-2 px-3 py-2 bg-primary/5 text-primary text-sm rounded-md border border-primary/10 w-fit font-medium">
                  <Shield className="h-4 w-4" />
                  {user?.role === "ADMIN" ? "Coordinator" : "Field Agent"}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-soft">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Notifications</CardTitle>
              </div>
              <CardDescription>Configure how you receive updates.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground italic">Notification preferences coming soon...</p>
            </CardContent>
          </Card>

          <Card className="border-destructive/20 bg-destructive/5 shadow-none">
            <CardHeader>
              <CardTitle className="text-lg text-destructive">Danger Zone</CardTitle>
              <CardDescription>Actions that cannot be undone.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" onClick={handleLogout} className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Sign out of account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Settings;
