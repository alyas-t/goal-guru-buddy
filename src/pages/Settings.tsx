
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Bell, UserCircle, MessageSquare, Lock, Volume2 } from "lucide-react";

const Settings = () => {
  const { user, updateUser } = useAuth();
  
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Notification settings
  const [dailyReminders, setDailyReminders] = useState(true);
  const [weeklyRecap, setWeeklyRecap] = useState(true);
  const [achievementAlerts, setAchievementAlerts] = useState(true);
  
  // Coach settings
  const [coachVoice, setCoachVoice] = useState("balanced");
  const [responseLength, setResponseLength] = useState("medium");
  const [textToSpeech, setTextToSpeech] = useState(true);
  
  const handleProfileUpdate = async () => {
    if (!name) {
      toast.error("Name cannot be empty");
      return;
    }
    
    setIsUpdating(true);
    
    try {
      await updateUser({ name });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold">Settings</h1>
      
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile" className="gap-2">
            <UserCircle size={16} />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell size={16} />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="coach" className="gap-2">
            <MessageSquare size={16} />
            <span>Coach Settings</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>
                Manage your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={email}
                  disabled
                  className="h-11 bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleProfileUpdate} 
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin mr-2"></div>
                    Updating...
                  </>
                ) : (
                  "Save changes"
                )}
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="glass-card mt-6">
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Update your password
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  placeholder="••••••••"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="••••••••"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  className="h-11"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline">
                <Lock size={16} className="mr-2" />
                Change Password
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Daily Reminders</h3>
                  <p className="text-sm text-muted-foreground">Receive a morning check-in and evening reflection reminder</p>
                </div>
                <Switch 
                  checked={dailyReminders} 
                  onCheckedChange={setDailyReminders} 
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Weekly Progress Recap</h3>
                  <p className="text-sm text-muted-foreground">Get a summary of your weekly progress every Sunday</p>
                </div>
                <Switch 
                  checked={weeklyRecap} 
                  onCheckedChange={setWeeklyRecap} 
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Achievement Alerts</h3>
                  <p className="text-sm text-muted-foreground">Get notified when you reach a milestone or complete a goal</p>
                </div>
                <Switch 
                  checked={achievementAlerts} 
                  onCheckedChange={setAchievementAlerts} 
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => toast.success("Notification settings saved")}>
                Save preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="coach">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Coach Settings</CardTitle>
              <CardDescription>
                Customize how your AI coach interacts with you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="coach-voice">Coach Personality</Label>
                <Select value={coachVoice} onValueChange={setCoachVoice}>
                  <SelectTrigger id="coach-voice" className="h-11">
                    <SelectValue placeholder="Select personality style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="supportive">Supportive & Encouraging</SelectItem>
                    <SelectItem value="challenging">Challenging & Direct</SelectItem>
                    <SelectItem value="analytical">Analytical & Strategic</SelectItem>
                    <SelectItem value="balanced">Balanced & Adaptable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="response-length">Response Length</Label>
                <Select value={responseLength} onValueChange={setResponseLength}>
                  <SelectTrigger id="response-length" className="h-11">
                    <SelectValue placeholder="Select response length" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="concise">Concise</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="detailed">Detailed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Text-to-Speech</h3>
                  <p className="text-sm text-muted-foreground">Have your coach speak responses out loud</p>
                </div>
                <Switch 
                  checked={textToSpeech} 
                  onCheckedChange={setTextToSpeech} 
                />
              </div>
              
              {textToSpeech && (
                <div className="bg-secondary/50 rounded-lg p-4 border border-border flex items-center gap-3">
                  <Volume2 className="text-primary h-5 w-5" />
                  <div>
                    <p className="text-sm">Test your coach's voice</p>
                    <Button variant="link" className="h-auto p-0 text-primary text-sm">
                      Play sample
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={() => toast.success("Coach settings updated")}>
                Save preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
