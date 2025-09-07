"use client";

import { motion, type Variants } from "framer-motion";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function UnauthorizedPage() {
  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const guardVariants: Variants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: 0.2,
      },
    },
  };

  return (
    <div className="min-h-screen h-screen max-h-screen flex items-center justify-center p-4 bg-gray-100 dark:bg-sky-100 relative overflow-hidden font-primary">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gray-200/30 dark:bg-gray-700/20 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-purple-200/20 dark:bg-purple-800/10 blur-3xl" />
      </div>

      <motion.div
        className="max-w-2xl w-full text-center relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={guardVariants} className="mb-8">
          <div className="flex items-center justify-center mb-6">
            <Image
              src="/unauthorized/forbidden.png"
              alt="403 Access Denied - Security Guard"
              width={300}
              height={200}
              className="drop-shadow-lg"
              priority
            />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900  mb-4">
            Oops! Access Denied
          </h1>
          <p className="text-lg text-gray-600 max-w-lg mx-auto leading-relaxed">
            The page you are looking for might have been removed or you have no
            permission to view it.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-4">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              asChild
              size="lg"
              className="bg-sky-500 hover:bg-sky-600 text-white px-8 py-6 text-lg font-semibold rounded-lg shadow-lg"
            >
              <Link href="/">
                <Home className="w-5 h-5 mr-2" />
                Go to Dashboard
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
