import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Shield,
  Calculator,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  Target,
  FileCheck,
  Zap,
} from "lucide-react"

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section - More compact */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 w-full">
        <div className="container mx-auto px-4 py-8 pb-4 lg:py-12 lg:pb-6">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-3 flex justify-center">
              <div className="relative">
                <div
                  className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center shadow-lg"
                  style={{ boxShadow: "0 8px 16px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.2)" }}
                >
                  <Shield className="h-10 w-10 text-white drop-shadow-lg" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-5 h-5 bg-white rounded-full opacity-20" />
                  </div>
                </div>
              </div>
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-5xl mb-3">
              <span className="text-primary">MAXimum Security</span>{" "}
              <span className="text-2xl sm:text-3xl">Prioritisation Calculator</span>
            </h1>

            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Streamline your application security evaluations with intelligent risk assessment. Make informed decisions
              faster.
            </p>

            <div className="flex justify-center">
              <Button
                asChild
                className="w-40 h-40 rounded-2xl text-lg font-bold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-200 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-2 border-blue-400 hover:border-blue-300"
                style={{ boxShadow: "0 8px 25px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)" }}
              >
                <Link href="/calculator" className="flex flex-col items-center justify-center gap-3">
                  <Calculator className="h-10 w-10" />
                  <span className="text-base leading-tight">
                    Start
                    <br />
                    Evaluation
                  </span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Combined Features, How It Works & Results Section with Tabs */}
      <section className="py-6 bg-gray-50 dark:bg-gray-900 w-full">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="why-choose" className="w-full">
            <div className="text-center mb-4">
              <TabsList className="inline-flex">
                <TabsTrigger value="why-choose">Why Choose Our Security Calculator?</TabsTrigger>
                <TabsTrigger value="how-it-works">How It Works</TabsTrigger>
                <TabsTrigger value="results">Results & Recommendations</TabsTrigger>
              </TabsList>
            </div>

            {/* Why Choose Our Security Calculator Tab */}
            <TabsContent value="why-choose">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Why Choose Our Security Calculator?</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
                  Built for security professionals who need to evaluate applications quickly and consistently
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                <Card className="border hover:border-primary/50 transition-colors">
                  <CardHeader className="p-4">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-2">
                      <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <CardTitle className="text-base">Fast & Efficient</CardTitle>
                    <CardDescription className="text-xs">
                      Complete comprehensive security evaluations in minutes, not hours.
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="border hover:border-primary/50 transition-colors">
                  <CardHeader className="p-4">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-2">
                      <Target className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <CardTitle className="text-base">Intelligent Scoring</CardTitle>
                    <CardDescription className="text-xs">
                      Advanced weighted scoring system for accurate risk assessments.
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="border hover:border-primary/50 transition-colors">
                  <CardHeader className="p-4">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-2">
                      <FileCheck className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <CardTitle className="text-base">Compliance Ready</CardTitle>
                    <CardDescription className="text-xs">
                      Built-in compliance checks for GDPR and industry standards.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </TabsContent>

            {/* How It Works Tab */}
            <TabsContent value="how-it-works">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">How It Works</h2>
                <p className="text-lg text-muted-foreground">Simple 3-step process to evaluate any application</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-primary-foreground">1</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Enter App Details</h3>
                  <p className="text-sm text-muted-foreground">
                    Provide basic information about the application and platform type.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-primary-foreground">2</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Answer Security Criteria</h3>
                  <p className="text-sm text-muted-foreground">
                    Work through platform-specific security questions with guidance.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-primary-foreground">3</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Get Instant Results</h3>
                  <p className="text-sm text-muted-foreground">Receive a security score with clear recommendations.</p>
                </div>
              </div>
            </TabsContent>

            {/* Results Tab */}
            <TabsContent value="results">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Results & Recommendations</h2>
                <p className="text-lg text-muted-foreground">
                  Get instant recommendations based on comprehensive security analysis
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                <Card className="border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800">
                  <CardHeader className="text-center p-4">
                    <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <CardTitle className="text-green-800 dark:text-green-200 text-base">Approve</CardTitle>
                    <CardDescription className="text-xs">Score: 80-100</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-xs text-green-700 dark:text-green-300 text-center">
                      Application meets security requirements.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20 dark:border-yellow-800">
                  <CardHeader className="text-center p-4">
                    <AlertTriangle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                    <CardTitle className="text-yellow-800 dark:text-yellow-200 text-base">Conditional</CardTitle>
                    <CardDescription className="text-xs">Score: 60-79</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-xs text-yellow-700 dark:text-yellow-300 text-center">
                      Approve with additional security controls.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800">
                  <CardHeader className="text-center p-4">
                    <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                    <CardTitle className="text-red-800 dark:text-red-200 text-base">Reject</CardTitle>
                    <CardDescription className="text-xs">Score: 0-59</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-xs text-red-700 dark:text-red-300 text-center">
                      Does not meet security requirements.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section - More compact */}
      <section className="py-6 bg-primary text-primary-foreground w-full">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-2">Ready to Secure Your Applications?</h2>
          <p className="text-base mb-4 opacity-90 max-w-2xl mx-auto">
            Start evaluating your applications today with our comprehensive security assessment tool.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="secondary">
              <Link href="/calculator">
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              className="bg-white text-black dark:bg-gray-100 dark:text-black border-2 border-white dark:border-gray-100 hover:bg-gray-100 hover:text-black dark:hover:bg-white dark:hover:text-black"
            >
              <Link href="/admin">Admin Panel</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
