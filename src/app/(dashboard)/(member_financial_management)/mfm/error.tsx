"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  RefreshCw,
  Home,
  ClipboardCopy,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setShowDetails(false);
  }, [error]);

  const copyError = async () => {
    try {
      await navigator.clipboard.writeText(error?.message || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (_) {}
  };

  return (
    <div className="min-h-[60vh] md:min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-xl"
      >
        <div className="rounded-2xl bg-white shadow-xl ring-1 ring-black/5 p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="shrink-0 rounded-2xl bg-red-50 p-3 text-red-600">
              <AlertTriangle className="h-6 w-6" aria-hidden />
            </div>
            <div className="flex-1">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900">
                Something went wrong 
              </h2>
              <p className="mt-1 text-gray-600">
                Sorry about that! We’re working on it. You can try again below.
              </p>

              {/* Error summary */}
              {error?.message && (
                <div className="mt-4 grid gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Error Message
                      </p>
                      <p className="mt-0.5 text-lg text-gray-700 break-words">
                        {error.message}
                      </p>
                    </div>
                    <button
                      onClick={copyError}
                      className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-white active:scale-[.99]"
                      aria-label="Copy error message"
                    >
                      <ClipboardCopy className="h-4 w-4" />
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>

                  <button
                    onClick={() => setShowDetails((s) => !s)}
                    className="group inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
                    aria-expanded={showDetails}
                  >
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        showDetails ? "rotate-180" : ""
                      }`}
                    />
                    Show details
                  </button>

                  {showDetails && (
                    <pre className="max-h-64 overflow-auto rounded-lg bg-white p-3 text-xs leading-relaxed text-gray-800">
                      {String(error?.stack || "No stack trace available.")}
                    </pre>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => reset()}
                  className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2.5 text-white shadow-sm hover:bg-blue-700 active:scale-[.99]"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try again
                </button>

                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-2xl border border-gray-300 bg-white px-4 py-2.5 text-gray-800 hover:bg-gray-50"
                >
                  <Home className="h-4 w-4" />
                  Back to homepage
                </Link>
              </div>

              {/* Tips */}
              <div className="mt-6 text-xs text-gray-500">
                <p>
                  If this keeps happening, try refreshing the page or come back
                  later.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
