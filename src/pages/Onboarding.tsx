
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CheckCircle2, ChevronRight, Target, Book, Heart, Brain, Dumbbell, Briefcase, Clock } from "lucide-react";

const OnboardingSteps = [
  {
    id: "goals",
    title: "What are your goals?",
    description: "Select the areas you want to focus on"
  },
  {
    id: "coach",
    title: "Customize your coach",
    description: "How would you like your AI coach to interact with you?"
  },
  {
    id: "habits",
    title: "Daily Habits",
    description: "Tell us about your current routine"
  },
  {
    id: "confirmation",
    title: "You're all set!",
    description: "Let's start your coaching journey"
  }
];

const goalCategories = [
  { id: "fitness", label: "Fitness & Health", icon: Dumbbell, color: "bg-blue-500" },
  { id: "mindfulness", label: "Mindfulness & Mental Health", icon: Brain, color: "bg-purple-500" },
  { id: "career", label: "Career & Skills", icon: Briefcase, color: "bg-green-500" },
  { id: "learning", label: "Learning & Education", icon: Book, color: "bg-amber-500" },
  { id: "relationships", label: "Relationships", icon: Heart, color: "bg-pink-500" },
  { id: "productivity", label: "Productivity & Time Management", icon: Clock, color: "bg-indigo-500" }
];

const coachPersonalities = [
  { id: "supportive", label: "Supportive & Encouraging", description: "Focuses on positive reinforcement and celebrating your wins" },
  { id: "challenging", label: "Challenging & Direct", description: "Pushes you out of your comfort zone and holds you accountable" },
  { id: "analytical", label: "Analytical & Strategic", description: "Takes a data-driven approach to help you optimize your habits" },
  { id: "balanced", label: "Balanced & Adaptable", description: "Adjusts coaching style based on your needs and situation" }
];

const Onboarding = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [coachPersonality, setCoachPersonality] = useState("balanced");
  const [morningRoutine, setMorningRoutine] = useState("");
  const [eveningRoutine, setEveningRoutine] = useState("");
  const [challenges, setChallenges] = useState("");
  
  const handleGoalToggle = (goalId: string) => {
    setSelectedGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(id => id !== goalId) 
        : [...prev, goalId]
    );
  };
  
  const handleNext = () => {
    if (currentStep < OnboardingSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  const handleComplete = async () => {
    setLoading(true);
    
    try {
      // In a real app, this would save all collected data to the database
      await updateUser({ hasCompletedOnboarding: true });
      
      toast.success("Onboarding completed!", {
        description: "Your personal coach is ready to help you achieve your goals.",
      });
      
      // Navigate to dashboard
      navigate("/");
    } catch (error) {
      toast.error("Failed to complete onboarding. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  // Validate current step
  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 0: // Goals
        return selectedGoals.length > 0;
      case 1: // Coach personality
        return !!coachPersonality;
      case 2: // Habits
        return !!morningRoutine || !!eveningRoutine || !!challenges;
      default:
        return true;
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <header className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className="rounded-full px-3 py-0.5">
            {currentStep + 1} of {OnboardingSteps.length}
          </Badge>
        </div>
        <h1 className="text-3xl font-bold">{OnboardingSteps[currentStep].title}</h1>
        <p className="text-muted-foreground">{OnboardingSteps[currentStep].description}</p>
      </header>
      
      <Card className="glass-card">
        <CardContent className="pt-6">
          {/* Step 1: Goals */}
          {currentStep === 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {goalCategories.map(category => (
                  <div
                    key={category.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                      selectedGoals.includes(category.id)
                        ? `border-2 border-primary shadow-md ${category.color} bg-opacity-10`
                        : "hover:border-primary/50 hover:bg-secondary/50"
                    }`}
                    onClick={() => handleGoalToggle(category.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${category.color} flex items-center justify-center text-white`}>
                        <category.icon size={18} />
                      </div>
                      <div>
                        <h3 className="font-medium">{category.label}</h3>
                      </div>
                      {selectedGoals.includes(category.id) && (
                        <CheckCircle2 className="ml-auto text-primary h-5 w-5" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">Select one or more areas you want to focus on with your coach</p>
            </div>
          )}
          
          {/* Step 2: Coach Personality */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <RadioGroup value={coachPersonality} onValueChange={setCoachPersonality}>
                <div className="grid gap-3">
                  {coachPersonalities.map(personality => (
                    <div
                      key={personality.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                        coachPersonality === personality.id
                          ? "border-2 border-primary shadow-md bg-primary/5"
                          : "hover:border-primary/50 hover:bg-secondary/50"
                      }`}
                      onClick={() => setCoachPersonality(personality.id)}
                    >
                      <div className="flex items-start gap-3">
                        <RadioGroupItem value={personality.id} id={personality.id} className="mt-1" />
                        <div>
                          <Label htmlFor={personality.id} className="text-base font-medium">{personality.label}</Label>
                          <p className="text-sm text-muted-foreground mt-1">{personality.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
          )}
          
          {/* Step 3: Habits */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="morning-routine">Morning Routine</Label>
                <Textarea
                  id="morning-routine"
                  placeholder="Describe your typical morning routine..."
                  rows={3}
                  value={morningRoutine}
                  onChange={(e) => setMorningRoutine(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="evening-routine">Evening Routine</Label>
                <Textarea
                  id="evening-routine"
                  placeholder="Describe your typical evening routine..."
                  rows={3}
                  value={eveningRoutine}
                  onChange={(e) => setEveningRoutine(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="challenges">Current Challenges</Label>
                <Textarea
                  id="challenges"
                  placeholder="What challenges are you facing in achieving your goals?"
                  rows={3}
                  value={challenges}
                  onChange={(e) => setChallenges(e.target.value)}
                />
              </div>
            </div>
          )}
          
          {/* Step 4: Confirmation */}
          {currentStep === 3 && (
            <div className="py-6 text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target size={36} className="text-primary" />
              </div>
              <h2 className="text-2xl font-semibold">You're all set!</h2>
              <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                We've set up your personal coach based on your preferences. Your coach is ready to help you achieve your goals and build lasting habits.
              </p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          {currentStep > 0 ? (
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
          ) : (
            <div></div>
          )}
          
          {currentStep < OnboardingSteps.length - 1 ? (
            <Button 
              onClick={handleNext}
              disabled={!isCurrentStepValid()}
            >
              Continue
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button 
              onClick={handleComplete}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin mr-2"></div>
                  Setting up your coach...
                </>
              ) : (
                "Get Started"
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default Onboarding;
