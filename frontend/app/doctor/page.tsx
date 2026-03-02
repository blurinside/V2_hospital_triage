"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { X } from "lucide-react"

export default function DoctorDashboard() {
  const BASE_URL = "http://localhost:8000"

  const [visits, setVisits] = useState<any[]>([])
  const [selectedVisit, setSelectedVisit] = useState<any | null>(null)
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false)

  const [prescriptions, setPrescriptions] = useState<any[]>([])

  const [medicineName, setMedicineName] = useState("")
  const [dosagePerDay, setDosagePerDay] = useState(1)
  const [tabletsPerDose, setTabletsPerDose] = useState(1)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [remarks, setRemarks] = useState("")

  /* ================= LOAD VISITS ================= */

  useEffect(() => {
    fetchVisits()
  }, [])

  const fetchVisits = async () => {
    try {
      const res = await fetch(`${BASE_URL}/visits`)
      const data = await res.json()

      const sorted = data
        .filter((v: any) => v.status === "OPEN")
        .sort(
          (a: any, b: any) =>
            (b.risk_probability || 0) - (a.risk_probability || 0)
        )

      setVisits(sorted)
    } catch (err) {
      console.error("Error fetching visits", err)
    }
  }

  /* ================= LOAD PRESCRIPTIONS ================= */

  useEffect(() => {
    if (!selectedVisit || !showPrescriptionModal) return

    const fetchPrescriptions = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/prescriptions/${selectedVisit.id}`
        )
        const data = await res.json()
        setPrescriptions(data)
      } catch (err) {
        console.error("Failed loading prescriptions", err)
      }
    }

    fetchPrescriptions()
  }, [selectedVisit, showPrescriptionModal])

  /* ================= ADD PRESCRIPTION ================= */

  const handleAddPrescription = async () => {
    if (!medicineName || !startDate || !endDate) {
      alert("Fill all required fields")
      return
    }

    const days =
      Math.ceil(
        (new Date(endDate).getTime() -
          new Date(startDate).getTime()) /
          (1000 * 60 * 60 * 24)
      ) + 1

    const total = days * dosagePerDay * tabletsPerDose

    try {
      const res = await fetch(`${BASE_URL}/prescriptions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visit_id: selectedVisit.id,
          medicine_name: medicineName,
          dosage_per_day: dosagePerDay,
          tablets_per_dose: tabletsPerDose,
          start_date: startDate,
          end_date: endDate,
          total_tablets: total,
          remarks: remarks,
        }),
      })

      if (!res.ok) throw new Error("Failed")

      const newPrescription = await res.json()

      setPrescriptions([...prescriptions, newPrescription])

      setMedicineName("")
      setDosagePerDay(1)
      setTabletsPerDose(1)
      setStartDate("")
      setEndDate("")
      setRemarks("")

    } catch (err) {
      console.error("Error adding prescription", err)
    }
  }

  /* ================= COMPLETE VISIT ================= */
  const handleCompleteVisit = async () => {
  if (!selectedVisit) return

  try {
    const res = await fetch(
      `${BASE_URL}/visits/${selectedVisit.id}/complete`,
      { method: "PUT" }
    )

    if (!res.ok) {
      console.error("Failed to complete visit")
      return
    }

    // Refresh visits list
    await fetchVisits()

    // Close modal
    setShowPrescriptionModal(false)

    // Remove from right panel
    setSelectedVisit(null)

  } catch (err) {
    console.error("Error completing visit:", err)
  }
}
  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-background">
      <main className="min-h-screen pb-24">

        {/* HEADER */}
        <header className="sticky top-0 z-30 border-b bg-card/80 backdrop-blur-sm">
          <div className="flex h-16 items-center px-6">
            <h1 className="text-2xl font-semibold">
              Doctor Dashboard
            </h1>
          </div>
        </header>

        <div className="p-6 grid grid-cols-3 gap-6">

          {/* LEFT PANEL */}
          <Card className="min-h-[78vh]">
            <CardContent className="p-4 overflow-y-auto space-y-2">

              {visits.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVisit(v)}
                  className="w-full text-left p-3 rounded-lg border hover:bg-muted mb-2"
                >
                  <div className="flex justify-between">
                    <div>
                      <div className="font-medium text-sm">
                        Visit {v.id} – {v.patient_name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {v.rfv_text}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs">Risk</div>
                      <div className="font-semibold">
                        {(v.risk_probability * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  {v.classification && (
                    <Badge
                      className={`mt-2 ${
                        v.classification === "Critical"
                          ? "bg-red-600 text-white"
                          : v.classification === "Urgent"
                          ? "bg-orange-500 text-white"
                          : "bg-yellow-500 text-white"
                      }`}
                    >
                      {v.classification}
                    </Badge>
                  )}
                </button>
              ))}

            </CardContent>
          </Card>

          {/* RIGHT PANEL */}
          <div className="col-span-2">

            {selectedVisit ? (
              <Card className="min-h-[78vh]">
                <CardContent className="p-6 space-y-6">

{/* ================= HEADER ================= */}

<div className="flex justify-between items-center">
  <h2 className="text-2xl font-semibold">
    Consultation – Visit {selectedVisit.id}
  </h2>
  <Badge>{selectedVisit.status}</Badge>
</div>

{/* ================= PATIENT CARD ================= */}

<div className="bg-muted/20 rounded-2xl p-6">

  <h3 className="text-lg font-semibold mb-6">
    Patient Credentials
  </h3>

  <div className="grid grid-cols-3 gap-y-6 gap-x-10 text-sm">

    <div>
      <p className="text-muted-foreground text-xs">Patient ID</p>
      <p className="font-medium">{selectedVisit.patient_id}</p>
    </div>

    <div>
      <p className="text-muted-foreground text-xs">Name</p>
      <p className="font-medium">{selectedVisit.patient_name}</p>
    </div>

    <div>
      <p className="text-muted-foreground text-xs">Gender</p>
      <p className="font-medium">{selectedVisit.gender}</p>
    </div>

    <div>
      <p className="text-muted-foreground text-xs">Age</p>
      <p className="font-medium">{selectedVisit.age}</p>
    </div>

    <div>
      <p className="text-muted-foreground text-xs">Email</p>
      <p className="font-medium">{selectedVisit.email}</p>
    </div>

    <div>
      <p className="text-muted-foreground text-xs">Heart Rate</p>
      <p className="font-medium">{selectedVisit.pulse} bpm</p>
    </div>

    <div>
      <p className="text-muted-foreground text-xs">Blood Pressure</p>
      <p className="font-medium">
        {selectedVisit.systolic_bp}/{selectedVisit.diastolic_bp} mmHg
      </p>
    </div>

    <div className="col-span-3">
      <p className="text-muted-foreground text-xs">Symptoms</p>
      <p className="font-medium">
        {selectedVisit.rfv_text}
      </p>
    </div>

  </div>
</div>

{/* ================= ACTION BUTTONS ================= */}

<div className="space-y-4">

  <Button
    onClick={() => setShowPrescriptionModal(true)}
    className="w-full"
  >
    Add / View Prescriptions
  </Button>

  <Button
    onClick={async () => {
      try {
        const overrideRes = await fetch(
          `${BASE_URL}/override/${selectedVisit.id}`,
          { method: "PUT" }
        )

        if (!overrideRes.ok) {
          throw new Error("Override failed")
        }

        const visitsRes = await fetch(`${BASE_URL}/visits`)
        const data = await visitsRes.json()

        const sortedVisits = data
          .filter((v: any) => v.status === "OPEN")
          .sort(
            (a: any, b: any) =>
              (b.risk_probability || 0) -
              (a.risk_probability || 0)
          )

        setVisits(sortedVisits)

        const updated = sortedVisits.find(
          (v: any) => v.id === selectedVisit.id
        )

        setSelectedVisit(updated)

      } catch (error) {
        console.error("Override error:", error)
      }
    }}
    className="w-full bg-red-600 text-white"
  >
    Escalate / Revert
  </Button>

</div>                  
                    
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

        {/* ================= MODAL ================= */}

        {showPrescriptionModal && selectedVisit && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white w-[1000px] max-h-[90vh] overflow-y-auto rounded-xl p-6 relative">

              <button
                onClick={() => setShowPrescriptionModal(false)}
                className="absolute top-4 right-4"
              >
                <X />
              </button>

              <h2 className="text-xl font-semibold mb-6">
                Consultation – Visit {selectedVisit.id}
              </h2>

              {/* PATIENT DETAILS */}
              <div className="border rounded-xl p-4 space-y-2 bg-muted/30">
                <p><b>Patient ID:</b> {selectedVisit.patient_id}</p>
                <p><b>Name:</b> {selectedVisit.patient_name}</p>
                <p><b>Age:</b> {selectedVisit.age}</p>
                <p><b>Blood Pressure:</b> {selectedVisit.systolic_bp}/{selectedVisit.diastolic_bp} mmHg</p>
                <p><b>Heart Rate:</b> {selectedVisit.pulse} bpm</p>
                <p><b>Symptoms:</b> {selectedVisit.rfv_text}</p>
              </div>

              {/* REMARKS */}
              <div className="mt-6">
                <Label>Remarks</Label>
                <Textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
              </div>

              {/* PRESCRIPTION TABLE */}
              <div className="mt-6 border rounded-xl p-4">

                <div className="grid grid-cols-6 gap-3 mb-4 font-medium text-sm">
                  <div>Medicine</div>
                  <div>Dosage/Day</div>
                  <div>Tabs/Dose</div>
                  <div>Start</div>
                  <div>End</div>
                  <div>Total</div>
                </div>

                <div className="grid grid-cols-6 gap-3 mb-4">
                  <Input value={medicineName} onChange={(e)=>setMedicineName(e.target.value)} />
                  <Input type="number" value={dosagePerDay} onChange={(e)=>setDosagePerDay(Number(e.target.value))}/>
                  <Input type="number" value={tabletsPerDose} onChange={(e)=>setTabletsPerDose(Number(e.target.value))}/>
                  <Input type="date" value={startDate} onChange={(e)=>setStartDate(e.target.value)}/>
                  <Input type="date" value={endDate} onChange={(e)=>setEndDate(e.target.value)}/>
                  <Button onClick={handleAddPrescription}>Add</Button>
                </div>

                {prescriptions.map((p)=>(
                  <div key={p.id} className="grid grid-cols-6 gap-3 text-sm border-t pt-2">
                    <div>{p.medicine_name}</div>
                    <div>{p.dosage_per_day}</div>
                    <div>{p.tablets_per_dose}</div>
                    <div>{p.start_date}</div>
                    <div>{p.end_date}</div>
                    <div>{p.total_tablets}</div>
                  </div>
                ))}

              </div>

              <Button
                className="w-full mt-6 bg-teal-600 text-white"
                onClick={handleCompleteVisit}
              >
                Mark as Completed
              </Button>

            </div>
          </div>
        )}

      </main>
    </div>
  )
}