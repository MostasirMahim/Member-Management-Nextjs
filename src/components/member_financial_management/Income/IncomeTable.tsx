"use client"

import { useState } from "react"
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreVertical, Eye, Trash2, DollarSign, User, CalendarDays } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { IncomeSearchFilterSection } from "./IncomeSearchFilterSection"
import { SmartPagination } from "@/components/utils/SmartPagination"

interface Income {
  id: number
  particular: string
  received_from_type: string
  receiving_type: string
  member: string
  received_by: string
  sale: string
  created_at: string
  updated_at: string
  is_active: boolean
  date: string
  receivable_amount: string
  discount_name: string
  discounted_amount: string
  final_receivable: string
  actual_received: string
  reaming_due: string
  due_payable_last_date: string | null
}

interface IncomesResponse {
  code: number
  status: string
  message: string
  data: Income[]
  pagination: {
    count: number
    total_pages: number
    current_page: number
    next: string | null
    previous: string | null
    page_size: number
  }
}

interface Props {
  incomes: IncomesResponse
}

export default function IncomeTable({ incomes }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [selectedIncome, setSelectedIncome] = useState<Income | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  // Pagination & Filters
  const pageParam = Number.parseInt(searchParams.get("page") || "1", 10)
  const itemsPerPage = 10

  const filterOptions = {
    members: Array.from(new Set(incomes.data.map((i) => i.member))),
    received_by: Array.from(new Set(incomes.data.map((i) => i.received_by))),
    receiving_types: Array.from(new Set(incomes.data.map((i) => i.receiving_type))),
  }

  const filterMember = searchParams.get("member") || ""
  const filterReceivedBy = searchParams.get("received_by") || "all"
  const filterReceivingType = searchParams.get("receiving_type") || "all"

  const filteredIncomes = incomes.data.filter((i) => {
    if (filterMember && !i.member.toLowerCase().includes(filterMember.toLowerCase())) return false
    if (filterReceivedBy !== "all" && i.received_by !== filterReceivedBy) return false
    if (filterReceivingType !== "all" && i.receiving_type !== filterReceivingType) return false
    return true
  })

  // Calculate pagination for SmartPagination
  const totalPages = Math.ceil(filteredIncomes.length / itemsPerPage)
  const currentPage = pageParam > totalPages ? 1 : pageParam
  const paginatedIncomes = filteredIncomes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // PaginationData format for SmartPagination
  const paginationData = {
    count: filteredIncomes.length,
    total_pages: totalPages,
    current_page: currentPage,
    next: currentPage < totalPages ? `?page=${currentPage + 1}` : null,
    previous: currentPage > 1 ? `?page=${currentPage - 1}` : null,
    page_size: itemsPerPage,
  }

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return
    const params = new URLSearchParams(Array.from(searchParams.entries()))
    params.set("page", page.toString())
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="w-full">
      <div>
        <CardHeader>
          <div className="flex flex-row items-center gap-2">
            <DollarSign className="h-7 w-7 text-primary drop-shadow" />
            <CardTitle className="text-xl md:text-2xl font-extrabold text-foreground tracking-tight">
              All Incomes
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent>
          <IncomeSearchFilterSection filterOptions={filterOptions} />

          <div className="w-full overflow-x-auto rounded-md border bg-background">
            <Table className="text-sm">
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="text-foreground font-bold">ID</TableHead>
                  <TableHead className="text-foreground font-bold">Particular</TableHead>
                  <TableHead className="text-foreground font-bold">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" /> Member
                    </div>
                  </TableHead>
                  <TableHead className="text-foreground font-bold">Received By</TableHead>
                  <TableHead className="text-foreground font-bold">Receiving Type</TableHead>
                  <TableHead className="text-foreground font-bold">Sale</TableHead>
                  <TableHead className="text-foreground font-bold">Receivable</TableHead>
                  <TableHead className="text-foreground font-bold">Final</TableHead>
                  <TableHead className="text-foreground font-bold">Received</TableHead>
                  <TableHead className="text-foreground font-bold">
                    <div className="flex items-center gap-1">
                      <CalendarDays className="h-4 w-4" /> Date
                    </div>
                  </TableHead>
                  <TableHead className="text-foreground font-bold">Status</TableHead>
                  <TableHead className="text-right text-foreground font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedIncomes.map((i) => (
                  <TableRow key={i.id} className="hover:bg-muted/50 transition-all duration-200 border-b border-border">
                    <TableCell className="font-semibold text-foreground">{i.id}</TableCell>
                    <TableCell>
                      <Badge className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20">
                        {i.particular}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-foreground">{i.member}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-blue-100 text-blue-700 border border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700">
                        {i.received_by}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-700 border border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700">
                        {i.receiving_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-muted-foreground">{i.sale}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-primary">{i.receivable_amount}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-yellow-700 dark:text-yellow-400">{i.final_receivable}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-green-700 dark:text-green-300">{i.actual_received}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-muted-foreground">{i.date ? new Date(i.date).toLocaleString() : ""}</span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          i.is_active
                            ? "bg-green-100 text-green-800 border border-green-200 hover:bg-green-200 transition-colors dark:bg-green-900/30 dark:text-green-300 dark:border-green-700"
                            : "bg-red-100 text-red-700 border border-red-200 hover:bg-red-200 transition-colors dark:bg-red-900/30 dark:text-red-300 dark:border-red-700"
                        }
                      >
                        {i.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                            <MoreVertical className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-background border border-border">
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/mfm/income/${i.id}`}
                              className="flex items-center text-primary hover:bg-muted cursor-pointer"
                            >
                              <Eye className="mr-2 h-4 w-4" /> View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive hover:bg-destructive/10 cursor-pointer"
                            onClick={() => {
                              setSelectedIncome(i)
                              setDeleteDialogOpen(true)
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Smart Pagination */}
          <SmartPagination paginationData={paginationData} />
        </CardContent>
      </div>
    </div>
  )
}
