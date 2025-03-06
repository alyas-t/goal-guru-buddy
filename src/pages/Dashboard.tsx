
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Plus, CheckCircle2, Circle, ChevronRight, BarChart3, Lightbulb } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

// Mock data types
interface Goal {
  id: string;
  title: string;
  description: string;
  progress: number;
  color: string;
}

interface DailyTask {
  id: string;
  title: string;
  completed: boolean;
  goalId?: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [quote, setQuote] = useState("");

  // Redirect to onboarding if not completed
  useEffect(() => {
    if (user && !user.hasCompletedOnboarding) {
      navigate("/onboarding");
    }
  }, [user, navigate]);

  // Fetch mock data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock goals
        const mockGoals: Goal[] = [
          { id: "1", title: "Improve Fitness", description: "Exercise regularly and maintain a balanced diet", progress: 65, color: "bg-blue-500" },
          { id: "2", title: "Learn Spanish", description: "Practice vocabulary and conversation daily", progress: 30, color: "bg-green-500" },
          { id: "3", title: "Mindfulness Practice", description: "Daily meditation and reflection", progress: 80, color: "bg-purple-500" }
        ];
        
        // Mock daily tasks
        const mockTasks: DailyTask[] = [
          { id: "1", title: "30 minutes cardio workout", completed: true, goalId: "1" },
          { id: "2", title: "Practice Spanish vocabulary", completed: false, goalId: "2" },
          { id: "3", title: "10 minute meditation", completed: true, goalId: "3" },
          { id: "4", title: "Drink 2L of water", completed: false },
          { id: "5", title: "Read for 30 minutes", completed: false }
        ];

        // Mock motivational quote
        const mockQuote = "The only way to do great work is to love what you do.";
        
        setGoals(mockGoals);
        setDailyTasks(mockTasks);
        setQuote(mockQuote);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const toggleTaskCompletion = (taskId: string) => {
    setDailyTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, completed: !task.completed }
          : task
      )
    );
    
    // Show toast on completion
    const task = dailyTasks.find(t => t.id === taskId);
    if (task && !task.completed) {
      toast.success("Task completed!", {
        description: `Great job completing "${task.title}"`,
      });
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="mt-4 text-muted-foreground animate-pulse">Loading dashboard<span className="loading-dots"></span></p>
        </div>
      </div>
    );
  }

  const completedTasksCount = dailyTasks.filter(task => task.completed).length;
  const taskCompletionPercentage = Math.round((completedTasksCount / dailyTasks.length) * 100);

  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="text-3xl font-bold">Welcome back, {user?.name}</h1>
        <p className="text-muted-foreground mt-1">Here's your progress for today</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1 md:col-span-2 glass-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Today's Progress</span>
              <span className="text-lg font-semibold">{taskCompletionPercentage}%</span>
            </CardTitle>
            <CardDescription>
              You've completed {completedTasksCount} of {dailyTasks.length} tasks for today
            </CardDescription>
            <Progress value={taskCompletionPercentage} className="h-2 mt-2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dailyTasks.map(task => (
                <div 
                  key={task.id} 
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
                  onClick={() => toggleTaskCompletion(task.id)}
                >
                  <div className="mt-0.5">
                    {task.completed ? (
                      <CheckCircle2 className="text-primary h-5 w-5" />
                    ) : (
                      <Circle className="text-muted-foreground h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={task.completed ? "line-through text-muted-foreground" : ""}>{task.title}</p>
                    {task.goalId && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {goals.find(g => g.id === task.goalId)?.title}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add New Task
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Daily Inspiration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
              <Lightbulb className="h-8 w-8 text-primary mb-3" />
              <blockquote className="text-lg italic">"{quote}"</blockquote>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="w-full" onClick={() => navigate("/chat")}>
              Chat with your coach
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <h2 className="text-2xl font-bold mt-6">Your Goals</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {goals.map(goal => (
          <Card key={goal.id} className="glass-card hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{goal.title}</span>
                <div className={`w-3 h-3 rounded-full ${goal.color}`}></div>
              </CardTitle>
              <CardDescription>{goal.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Progress</span>
                  <span className="text-sm font-medium">{goal.progress}%</span>
                </div>
                <Progress value={goal.progress} className={`h-2 ${goal.color.replace('bg-', 'bg-opacity-80 bg-')}`} />
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </CardFooter>
          </Card>
        ))}
        
        <Card className="border-dashed hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 flex flex-col items-center justify-center cursor-pointer">
          <div className="py-8">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-4 mx-auto">
              <Plus className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-center">Add New Goal</h3>
            <p className="text-muted-foreground text-center mt-1">Define what matters to you</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
