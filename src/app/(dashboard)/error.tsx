"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertTriangle, RefreshCw, Home, Bug } from "lucide-react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Error boundary caught:", error)
  }, [error])

  return (
    <div className="h-[500px] mt-[50px] flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="w-full max-w-2xl">
        <Card className="border-2 shadow-2xl backdrop-blur-sm bg-card/95">
          <div className="p-4 md:p-6 space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="absolute inset-0 bg-destructive/30 blur-3xl rounded-full animate-pulse" />
                <div className="relative bg-gradient-to-br from-destructive/20 to-destructive/10 p-8 rounded-full border-2 border-destructive/20">
                  <AlertTriangle className="w-14 h-14 md:w-20 md:h-20 text-destructive drop-shadow-lg" />
                </div>
              </div>

              <div className="text-center space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight text-balance">
                  Something went wrong
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground font-medium">
                  We encountered an unexpected error
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-muted/50 border border-border rounded-lg p-2 md:p-6">
                <div className="flex items-start gap-3">
                  <Bug className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="space-y-2 flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">Error Details</p>
                    <p className="text-sm text-muted-foreground font-mono break-words leading-relaxed">
                      {error.message || "An unexpected error occurred"}
                    </p>
                    {error.digest && (
                      <p className="text-xs text-muted-foreground/70 font-mono pt-2 border-t border-border/50">
                        Error ID: {error.digest}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2">
              <Button
                onClick={reset}
                size="lg"
                className="w-full sm:w-auto gap-2 font-semibold shadow-lg hover:shadow-xl transition-shadow"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </Button>

              <Link href="/" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full gap-2 font-semibold bg-background/50 hover:bg-accent/80"
                >
                  <Home className="w-4 h-4" />
                  Go Home
                </Button>
              </Link>
            </div>
            <div className="pt-6 border-t border-border/50">
              <p className="text-xs text-center text-muted-foreground/80 font-mono">
                {new Date().toLocaleString("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
