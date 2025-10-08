"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ServerCrash, RefreshCw, Home } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Global error boundary caught:", error)
  }, [error])

  return (
    <html lang="en">
      <body className="font-sans">
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 p-4">
          <div className="w-full max-w-2xl">
            <Card className="border-2 shadow-2xl backdrop-blur-sm bg-white/95 dark:bg-slate-900/95">
              <div className="p-8 md:p-12 space-y-8">
                <div className="flex flex-col items-center space-y-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-red-500/30 blur-3xl rounded-full animate-pulse" />
                    <div className="relative bg-gradient-to-br from-red-500/20 to-red-600/10 p-8 rounded-full border-2 border-red-500/30">
                      <ServerCrash className="w-20 h-20 md:w-24 md:h-24 text-red-600 dark:text-red-500 drop-shadow-lg" />
                    </div>
                  </div>

                  <div className="text-center space-y-3">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-50 tracking-tight text-balance">
                      Critical Error
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 font-medium">
                      The application encountered a fatal error
                    </p>
                  </div>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-4 md:p-6">
                  <p className="text-sm text-slate-700 dark:text-slate-300 font-mono break-words leading-relaxed">
                    {error.message || "An unexpected critical error occurred"}
                  </p>
                  {error.digest && (
                    <p className="text-xs text-slate-500 dark:text-slate-500 font-mono mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                      Error ID: {error.digest}
                    </p>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2">
                  <Button
                    onClick={reset}
                    size="lg"
                    className="w-full sm:w-auto gap-2 font-semibold shadow-lg hover:shadow-xl transition-shadow bg-slate-900 hover:bg-slate-800 dark:bg-slate-50 dark:hover:bg-slate-200 text-white dark:text-slate-900"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Reload Application
                  </Button>

                  <a href="/" className="w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full gap-2 font-semibold border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 bg-transparent"
                    >
                      <Home className="w-4 h-4" />
                      Go Home
                    </Button>
                  </a>
                </div>
                <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-xs text-center text-slate-500 dark:text-slate-500 font-mono">
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
      </body>
    </html>
  )
}
