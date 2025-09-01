
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Shield, AlertTriangle, Check, Mail, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default function Index() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | {
    score: number;
    isMalicious: boolean;
    confidence: number;
    warnings: string[];
    safeElements: string[];
  }>(null);

  // This would connect to your backend in a real implementation
  const analyzeEmail = () => {
    if (!email.trim()) return;
    
    setLoading(true);
    
    // Simulating API call to your backend service
    fetch("http://127.0.0.1:5000/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    })
      .then(res => res.json())
      .then(data => {
        setResult({
          score: data.email_score,
          isMalicious: data.phishing,
          confidence: data.email_score, // Optional, use for more metrics
          warnings: data.suspicious_words.length > 0 ? data.suspicious_words : ["No suspicious words"],
          safeElements: data.flagged_urls.length > 0 ? [] : ["No phishing URLs detected"]
        });
      })
      .catch((err) => {
        console.error("Error:", err);
        alert("Failed to analyze email. Is the Flask backend running?");
      })
      .finally(() => setLoading(false));    
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="w-full py-4 px-6 bg-white dark:bg-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              PhishEye
            </h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-slate-600 hover:text-blue-600 dark:text-slate-300">Home</a>
            <a href="#" className="text-slate-600 hover:text-blue-600 dark:text-slate-300">How It Works</a>
            <a href="#" className="text-slate-600 hover:text-blue-600 dark:text-slate-300">About</a>
            <Button variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50">
              Contact
            </Button>
          </nav>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <section className="mb-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Protect Yourself From Phishing Attacks
            </h1>
            <p className="text-lg text-slate-700 dark:text-slate-300 mb-8">
              Our advanced AI system analyzes emails to detect phishing attempts with high accuracy.
              Simply paste any suspicious email to get an instant security assessment.
            </p>
          </div>
        </section>
        
        {/* Email Analysis Section */}
        <section className="grid md:grid-cols-2 gap-8">
          <Card className="md:col-span-2 lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-blue-500" />
                Email Analysis
              </CardTitle>
              <CardDescription>
                Paste a suspicious email to check if it's a phishing attempt
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea 
                placeholder="Paste the entire email content here, including headers if available..."
                className="min-h-[200px]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                onClick={analyzeEmail} 
                disabled={loading || !email.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? "Analyzing..." : "Analyze Email"}
              </Button>
            </CardFooter>
          </Card>
          
          <Card className={`md:col-span-2 lg:col-span-1 ${!result ? 'opacity-75' : ''}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-500" />
                Analysis Results
              </CardTitle>
              <CardDescription>
                {result ? "Here's what our AI found about this email" : "Results will appear here after analysis"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-6">
                  {/* Verdict Banner */}
                  <div className={`p-4 rounded-lg flex items-center gap-3 ${
                    result.isMalicious 
                      ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200" 
                      : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                  }`}>
                    {result.isMalicious ? (
                      <>
                        <AlertTriangle className="h-6 w-6" />
                        <div>
                          <p className="font-medium">Warning: Potential Phishing Detected</p>
                          <p className="text-sm opacity-90">This email contains suspicious elements</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <Check className="h-6 w-6" />
                        <div>
                          <p className="font-medium">Email Appears Safe</p>
                          <p className="text-sm opacity-90">No significant phishing indicators found</p>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Threat Score */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Threat Score</span>
                      <Badge variant={result.score > 50 ? "destructive" : "outline"} className="text-xs">
                        {Math.round(result.score)}%
                      </Badge>
                    </div>
                    <Progress value={result.score} className={`h-2 ${
                      result.score > 75 ? "bg-red-200" : 
                      result.score > 50 ? "bg-orange-200" : 
                      result.score > 25 ? "bg-yellow-200" : "bg-green-200"
                    }`} />
                  </div>
                  
                  {/* Detailed Analysis */}
                  <Tabs defaultValue="warnings">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="warnings">Warning Signals</TabsTrigger>
                      <TabsTrigger value="safe">Safe Signals</TabsTrigger>
                    </TabsList>
                    <TabsContent value="warnings" className="space-y-2 mt-2">
                      {result.warnings.map((warning, i) => (
                        <div key={i} className="flex items-start gap-2 p-2 rounded bg-red-50 dark:bg-red-900/20">
                          <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                          <span className="text-sm">{warning}</span>
                        </div>
                      ))}
                    </TabsContent>
                    <TabsContent value="safe" className="space-y-2 mt-2">
                      {result.safeElements.map((element, i) => (
                        <div key={i} className="flex items-start gap-2 p-2 rounded bg-green-50 dark:bg-green-900/20">
                          <Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                          <span className="text-sm">{element}</span>
                        </div>
                      ))}
                    </TabsContent>
                  </Tabs>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px] text-center text-slate-400">
                  <Shield className="h-12 w-12 mb-4 opacity-40" />
                  <p className="text-lg font-medium">No Analysis Yet</p>
                  <p className="text-sm max-w-xs">Submit an email on the left to see detailed phishing analysis results</p>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
        
        {/* Features Section */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-10">How PhishEye Protects You</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">AI-Powered Detection</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Our machine learning algorithms analyze multiple aspects of emails to identify phishing attempts.
              </p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Real-time Analysis</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Get instant feedback on suspicious emails so you can make informed decisions.
              </p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Data Privacy</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Your email data is analyzed securely and never stored or shared with third parties.
              </p>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="mt-20 py-8 bg-slate-800 text-slate-300">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p>&copy; 2025 PhishEye. All rights reserved.</p>
          <p className="text-sm opacity-70 mt-2">A powerful phishing detection tool</p>
        </div>
      </footer>
    </div>
  );
}
