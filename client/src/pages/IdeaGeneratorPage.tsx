import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, Lightbulb, Clock, Target, Code, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface GeneratedIdea {
  id: number;
  title: string;
  estimatedTime: string;
  difficulty: string;
  tags: string[];
  description: string;
  techStack: string[];
}

const interestOptions = [
  { id: "community_tools", label: "Community Tools" },
  { id: "creative_projects", label: "Creative Projects" },
  { id: "problem_solving", label: "Problem Solving" },
  { id: "learning_tools", label: "Learning Tools" },
  { id: "wellness_lifestyle", label: "Wellness & Lifestyle" },
  { id: "business_tools", label: "Business Tools" },
];

const timeframeOptions = [
  { value: "1-2 hours", label: "1-2 hours" },
  { value: "2-3 hours", label: "2-3 hours" },
  { value: "3-4 hours", label: "3-4 hours" },
  { value: "4-6 hours", label: "4-6 hours" },
];

const skillLevelOptions = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

export default function IdeaGeneratorPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [skillLevel, setSkillLevel] = useState<string>("intermediate");
  const [timeframe, setTimeframe] = useState<string>("2-3 hours");
  const [ideas, setIdeas] = useState<GeneratedIdea[]>([]);

  const generateIdeasMutation = useMutation({
    mutationFn: async (data: {
      interests: string[];
      skillLevel: string;
      timeframe: string;
    }) => {
      const response = await apiRequest("POST", "/api/generate-ideas", data);
      return response.json();
    },
    onSuccess: (data) => {
      setIdeas(data.ideas);
      toast({
        title: "Ideas Generated!",
        description: `Generated ${data.ideas.length} project ideas for you`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to generate ideas",
        variant: "destructive",
      });
    },
  });

  const handleInterestChange = (interestId: string, checked: boolean) => {
    if (checked) {
      setSelectedInterests([...selectedInterests, interestId]);
    } else {
      setSelectedInterests(selectedInterests.filter((id) => id !== interestId));
    }
  };

  const handleGenerateIdeas = () => {
    generateIdeasMutation.mutate({
      interests: selectedInterests,
      skillLevel,
      timeframe,
    });
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <Lightbulb className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
            <p className="text-gray-600 mb-4">
              Please log in to generate project ideas tailored to your interests.
            </p>
            <Button asChild>
              <a href="/auth">Sign In</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
          <Lightbulb className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-3 text-gray-800">
          Community Impact Ideas
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Generate project ideas that add value to Providence and Rhode Island communities
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Configuration Panel */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Interests */}
              <div>
                <label className="text-sm font-medium mb-3 block">
                  Areas of Interest
                </label>
                <div className="space-y-2">
                  {interestOptions.map((interest) => (
                    <div key={interest.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={interest.id}
                        checked={selectedInterests.includes(interest.id)}
                        onCheckedChange={(checked) =>
                          handleInterestChange(interest.id, checked as boolean)
                        }
                      />
                      <label
                        htmlFor={interest.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {interest.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Skill Level */}
              <div>
                <label className="text-sm font-medium mb-3 block">
                  Skill Level
                </label>
                <Select value={skillLevel} onValueChange={setSkillLevel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {skillLevelOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Timeframe */}
              <div>
                <label className="text-sm font-medium mb-3 block">
                  Available Time
                </label>
                <Select value={timeframe} onValueChange={setTimeframe}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeframeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleGenerateIdeas}
                disabled={generateIdeasMutation.isPending}
                className="w-full"
              >
                {generateIdeasMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Generate Ideas
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Ideas Display */}
        <div className="lg:col-span-2">
          {ideas.length === 0 && !generateIdeasMutation.isPending ? (
            <Card className="h-full">
              <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                <Lightbulb className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Ready to Brainstorm?
                </h3>
                <p className="text-gray-500">
                  Configure your preferences and click "Generate Ideas" to get started
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {ideas.map((idea) => (
                <Card key={idea.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg flex-1 pr-4">
                        {idea.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        {idea.estimatedTime}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{idea.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="secondary">{idea.difficulty}</Badge>
                      {idea.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Code className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">
                          Suggested Tech Stack:
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {idea.techStack.map((tech) => (
                          <Badge key={tech} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}