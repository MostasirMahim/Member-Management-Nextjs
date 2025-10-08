"use client"

import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertCircle, RefreshCw, Home, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ErrorPage() {
  const params = useSearchParams()
  const code = params.get("code") || "500"

  const errorDetails: Record<string, { title: string; description: string; suggestion: string }> = {
    "401": {
      title: "Unauthorized",
      description: "You need to be authenticated to access this resource.",
      suggestion: "Please log in to continue.",
    },
    "402": {
      title: "Payment Required",
      description: "This resource requires an active subscription.",
      suggestion: "Please check your plan or upgrade to continue.",
    },
    "403": {
      title: "Forbidden",
      description: "You don't have permission to access this resource.",
      suggestion: "Contact support if you believe this is an error.",
    },
    "404": {
      title: "Not Found",
      description: "The page you're looking for doesn't exist.",
      suggestion: "Check the URL or return to the homepage.",
    },
    "405": {
      title: "Method Not Allowed",
      description: "The request method is not supported for this resource.",
      suggestion: "Please try a different approach.",
    },
    "500": {
      title: "Server Error",
      description: "Something went wrong on our end.",
      suggestion: "Please try again in a few moments.",
    },
  }

  const error = errorDetails[code] || errorDetails["500"]

  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <div className="h-[300px] flex items-center justify-center bg-background p-2 mt-[100px]">
      <div className="w-full max-w-2xl">
        <Card className="border-2 shadow-lg">
          <div className="p-4 space-y-2">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="absolute inset-0 bg-destructive/20 blur-2xl rounded-full animate-pulse" />
                <div className="relative bg-destructive/10 p-4 rounded-full">
                  <AlertCircle className="w-14 h-14 md:w-16 md:h-16 text-destructive" />
                </div>
              </div>

              <div className="text-center space-y-2">
                <h1 className="text-7xl md:text-6xl font-bold text-foreground tracking-tight">{code}</h1>
                <h2 className="text-2xl md:text-3xl font-semibold text-foreground">{error.title}</h2>
              </div>
            </div>
            <div className="text-center space-y-1 max-w-md mx-auto">
              <p className="text-lg text-muted-foreground leading-relaxed">{error.description}</p>
              <p className="text-sm text-muted-foreground/80">{error.suggestion}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-4">
              <Link href="/" className="w-full sm:w-auto">
                <Button variant="default" size="lg" className="w-full gap-2 font-medium ">
                  <Home className="w-4 h-4" />
                  Go Home
                </Button>
              </Link>

              <Button
                variant="ghost"
                size="lg"
                onClick={() => window.history.back()}
                className="w-full sm:w-auto gap-2 font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </Button>
            </div>

            <div className="pt-6 border-t border-border">
              <p className="text-xs text-center text-muted-foreground/60">
                Error Code: <span className="font-mono font-semibold">{code}</span>
                {" • "}
                <span className="font-mono">{new Date().toISOString().split("T")[0]}</span>
              </p>
            </div>
          </div>
        </Card>
        <p className="text-center text-sm text-muted-foreground mt-6">
          Need help?{" "}
          <Link href="/support" className="text-foreground hover:underline font-medium">
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  )
}
