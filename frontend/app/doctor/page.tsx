"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/hospital/sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { X } from "lucide-react"

export default function DoctorDashboard() {
  const [visits, setVisits] = useState<any[]>([])
  const [selectedVisit, setSelectedVisit] = useState<any | null>(null)
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false)

  /* ================= LOAD ALL OPEN VISITS ================= */

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const res = await fetch("http://localhost:8000/visits")
        const data = await res.json()

        // Show only OPEN visits
        const openVisits = data.filter((v: any) => v.status === "OPEN")

        setVisits(openVisits)
      } catch (error) {
        console.error("Error fetching visits:", error)
      }
    }

    fetchVisits()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <main className="ml-64 min-h-screen">

        {/* HEADER */}
        <header className="sticky top-0 z-30 border-b bg-card/80 backdrop-blur-sm">
          <div className="flex h-16 items-center px-6">
            <h1 className="text-2xl font-semibold">
              Doctor Dashboard
            </h1>
          </div>
        </header>

        <div className="p-6 grid grid-cols-3 gap-6">

          {/* ================= LEFT PANEL ================= */}

          <Card className="min-h-[78vh]">
            <CardContent className="p-4 overflow-y-auto space-y-2">

              {visits.length === 0 && (
                <div className="text-muted-foreground text-sm">
                  No open visits available
                </div>
              )}

              {visits.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVisit(v)}
                  className="w-full text-left p-3 rounded-lg border hover:bg-muted mb-2"
                >
                  <div className="font-medium text-sm">
                    Visit {v.id}
                  </div>

                  <div className="text-xs text-muted-foreground">
                    {v.rfv_text}
                  </div>

                  <Badge className="mt-1">{v.status}</Badge>
                </button>
              ))}

            </CardContent>
          </Card>

          {/* ================= RIGHT PANEL ================= */}

          <div className="col-span-2">

            {selectedVisit ? (
              <Card className="min-h-[78vh]">
                <CardContent className="p-6 space-y-6">

                  {/* Visit Header */}
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">
                      Visit {selectedVisit.id}
                    </h2>
                    <Badge>{selectedVisit.status}</Badge>
                  </div>

                  {/* Vitals Section */}
                  <div className="grid grid-cols-2 gap-4 text-sm">

                    <div>
                      <Label>Temperature</Label>
                      <Input value={selectedVisit.temperature} disabled />
                    </div>

                    <div>
                      <Label>Pulse</Label>
                      <Input value={selectedVisit.pulse} disabled />
                    </div>

                    <div>
                      <Label>Systolic BP</Label>
                      <Input value={selectedVisit.systolic_bp} disabled />
                    </div>

                    <div>
                      <Label>Diastolic BP</Label>
                      <Input value={selectedVisit.diastolic_bp} disabled />
                    </div>

                    <div className="col-span-2">
                      <Label>Reason for Visit</Label>
                      <Textarea
                        value={selectedVisit.rfv_text}
                        disabled
                      />
                    </div>

                  </div>

                  <Button
                    onClick={() => setShowPrescriptionModal(true)}
                    className="w-full"
                  >
                    Add / View Prescriptions
                  </Button>

                </CardContent>
              </Card>
            ) : (
              <Card className="col-span-2 flex items-center justify-center">
                <CardContent className="p-12 text-muted-foreground">
                  Select a visit to begin consultation
                </CardContent>
              </Card>
            )}

          </div>

        </div>

        {/* ================= PRESCRIPTION MODAL ================= */}

        {showPrescriptionModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white w-[900px] rounded-xl p-6 relative">

              <button
                onClick={() => setShowPrescriptionModal(false)}
                className="absolute top-4 right-4"
              >
                <X />
              </button>

              <h2 className="text-lg font-semibold mb-4">
                Consultation – Visit {selectedVisit?.id}
              </h2>

              <div className="grid grid-cols-4 gap-3 mb-4">
                <Input placeholder="Medicine name" />
                <Input placeholder="Dosage per day" type="number" />
                <Input placeholder="Tablets per dose" type="number" />
                <Input type="date" />
              </div>

              <Button className="w-full mb-6">
                Add Prescription
              </Button>

              <div className="border rounded-lg p-4 text-sm text-muted-foreground">
                Prescription table will display here
              </div>

              <Button className="w-full mt-6 bg-teal-600 text-white">
                Mark as Completed
              </Button>

            </div>
          </div>
        )}

      </main>
    </div>
  )
}