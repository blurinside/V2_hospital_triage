"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Clock, Users } from "lucide-react"

export default function CaseOverviewPage() {
  const [visits, setVisits] = useState<any[]>([])

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/visits")
        const data = await res.json()
        setVisits(data)
      } catch (err) {
        console.error("Failed to fetch visits", err)
      }
    }

    fetchVisits()
  }, [])

  // ✅ Calculate counts OUTSIDE useEffect
  const totalVisits = visits.length

  const criticalCount = visits.filter(
    (v) => v.classification === "Critical"
  ).length

  const urgentCount = visits.filter(
    (v) => v.classification === "Urgent"
  ).length

  const reviewCount = visits.filter(
    (v) => v.classification === "Needs Review"
  ).length

  const inReviewCount = visits.filter(
    (v) => v.status === "IN_REVIEW"
  ).length

  const completedCount = visits.filter(
    (v) => v.status === "COMPLETED"
  ).length

  return (
    <div className="min-h-screen bg-background">
      <main className="min-h-screen pb-24">
        <header className="sticky top-0 z-30 border-b bg-card/80 backdrop-blur-sm">
          <div className="flex h-16 items-center px-6">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                📊 Case Overview
              </h1>
              <p className="text-sm text-muted-foreground">
                Hospital Operations Dashboard
              </p>
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* 🔥 Change grid to 6 columns */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6 mb-8">

            {/* Total */}
            <Card>
              <CardContent className="pt-6 flex items-center gap-4">
                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalVisits}</p>
                  <p className="text-sm text-muted-foreground">
                    Total Visits
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Critical */}
            <Card>
              <CardContent className="pt-6 flex items-center gap-4">
                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-red-100">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-600">
                    {criticalCount}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Critical Cases
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 🟠 Urgent */}
            <Card>
              <CardContent className="pt-6 flex items-center gap-4">
                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-orange-100">
                  <AlertCircle className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-600">
                    {urgentCount}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Urgent Cases
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Needs Review */}
            <Card>
              <CardContent className="pt-6 flex items-center gap-4">
                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-yellow-100">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-600">
                    {reviewCount}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Needs Review
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* In Review */}
            <Card>
              <CardContent className="pt-6 flex items-center gap-4">
                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">
                    {inReviewCount}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    In Review
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Completed */}
            <Card>
              <CardContent className="pt-6 flex items-center gap-4">
                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-emerald-100">
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-600">
                    {completedCount}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Completed Cases
                  </p>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </main>
    </div>
  )
}