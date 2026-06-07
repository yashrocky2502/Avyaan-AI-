
"use client";

import React, { useState, useEffect } from "react";
import { 
  Bell, 
  Moon, 
  Sun, 
  Shield, 
  RotateCcw, 
  Info, 
  ChevronRight,
  User,
  ExternalLink,
  Github
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";

export function SettingsManager() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark";
    if (savedTheme) setTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    toast({
      title: "Theme updated",
      description: `Switching to ${newTheme} mode.`
    });
  };

  const handleReset = () => {
    localStorage.clear();
    toast({
      variant: "destructive",
      title: "Data Reset",
      description: "All local storage data has been cleared. Reloading...",
    });
    setTimeout(() => window.location.reload(), 1500);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        {/* Account & Preferences */}
        <Card className="border-border/40 bg-card/40">
          <CardHeader>
            <CardTitle className="font-headline text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-primary" /> Preferences
            </CardTitle>
            <CardDescription>Personalize your MarketPulse experience.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-bold">Dark Mode</Label>
                <p className="text-xs text-muted-foreground">Adjust the UI theme to your comfort.</p>
              </div>
              <div className="flex items-center gap-3">
                <Sun className="h-4 w-4 text-muted-foreground" />
                <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
                <Moon className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            
            <Separator className="bg-border/10" />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-bold">Real-time Notifications</Label>
                <p className="text-xs text-muted-foreground">Receive alerts for major market moves and news.</p>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>
          </CardContent>
        </Card>

        {/* Security & Data */}
        <Card className="border-border/40 bg-card/40">
          <CardHeader>
            <CardTitle className="font-headline text-lg flex items-center gap-2 text-destructive">
              <Shield className="h-5 w-5" /> Danger Zone
            </CardTitle>
            <CardDescription>Critical actions related to your application data.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-bold">Reset Application Data</Label>
                <p className="text-xs text-muted-foreground">Clear all bookmarks and cached settings. This cannot be undone.</p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="border-destructive/20 text-destructive hover:bg-destructive/10">
                    <RotateCcw className="h-4 w-4 mr-2" /> Reset All
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action will wipe all your bookmarks and settings from this browser's local storage.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleReset} className="bg-destructive text-destructive-foreground">
                      Yes, Reset Everything
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* About Sidebar */}
      <div className="space-y-6">
        <Card className="border-border/40 bg-card/40 overflow-hidden">
          <CardHeader className="bg-primary/5 pb-4">
            <CardTitle className="font-headline text-lg flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" /> About MarketPulse
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <p className="text-xs text-muted-foreground leading-relaxed">
              MarketPulse Pro is a high-performance financial terminal designed for modern investors. Built with React and optimized for real-time synthesis.
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30 text-[10px] font-bold uppercase">
                <span className="text-muted-foreground">Version</span>
                <span>2.4.0 (Stable)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30 text-[10px] font-bold uppercase">
                <span className="text-muted-foreground">Environment</span>
                <Badge variant="outline" className="text-[9px] border-primary/20 text-primary">Production</Badge>
              </div>
            </div>
            <Separator className="bg-border/10" />
            <div className="space-y-1">
              <Button variant="ghost" className="w-full justify-between text-xs h-9 font-bold px-2">
                User Guide <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Button>
              <Button variant="ghost" className="w-full justify-between text-xs h-9 font-bold px-2">
                Release Notes <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </Button>
              <Button variant="ghost" className="w-full justify-between text-xs h-9 font-bold px-2">
                Github Source <Github className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
