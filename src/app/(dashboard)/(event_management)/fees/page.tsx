"use client"

import { CreateFeeModal } from "@/components/events/CreateFeesModal"
import { FeesTable } from "@/components/events/FeesTable"
import { useState } from "react"

export default function FeesPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  return (
    <div className="container mx-auto">
      <FeesTable onCreateFee={() => setIsCreateModalOpen(true)} />
      <CreateFeeModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  )
}
