"use client";

import { motion } from "framer-motion";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-700 ">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-3">
          Oops! Something went wrong 
        </h2>
        <p className="text-gray-600 mb-6 font-bold">{error.message}</p>

       
      </motion.div>
    </div>
  );
}
