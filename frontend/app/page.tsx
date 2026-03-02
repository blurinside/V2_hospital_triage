"use client"

import type React from "react"
import { useState, useEffect } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { User, Ambulance, Activity, Heart, FileText, Send } from "lucide-react"

export default function StaffDashboard() {
  const [ambulanceTransfer, setAmbulanceTransfer] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [prediction, setPrediction] = useState<any>(null)
  const [arrivalTime, setArrivalTime] = useState("")
  const [injury, setInjury] = useState<number | null>(null)

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const hours = String(now.getHours()).padStart(2, "0")
      const minutes = String(now.getMinutes()).padStart(2, "0")
      setArrivalTime(`${hours}:${minutes}`)
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // ==============================
      // 1️⃣ CREATE PATIENT
      // ==============================
      const patientRes = await fetch("http://127.0.0.1:8000/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: (document.getElementById("name") as HTMLInputElement)?.value,
          age: Number((document.getElementById("age") as HTMLInputElement)?.value),
          gender: ((document.getElementById("age") as HTMLInputElement)?.value),
          email: (document.getElementById("email") as HTMLInputElement)?.value,
          phone: (document.getElementById("phone") as HTMLInputElement)?.value,
        }),
      })

      const patientData = await patientRes.json()

      // ==============================
      // 2️⃣ CREATE VISIT
      // ==============================
      const visitRes = await fetch("http://127.0.0.1:8000/visits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_id: patientData.id,

          temperature: Number((document.getElementById("temp") as HTMLInputElement)?.value || 0),
          pulse: Number((document.getElementById("pulse") as HTMLInputElement)?.value || 0),
          respiration: Number((document.getElementById("respiration") as HTMLInputElement)?.value || 0),
          systolic_bp: Number((document.getElementById("bp-systolic") as HTMLInputElement)?.value || 0),
          diastolic_bp: Number((document.getElementById("bp-diastolic") as HTMLInputElement)?.value || 0),
          pain_scale: Number((document.getElementById("pain") as HTMLInputElement)?.value || 0),

          arrival_mode: ambulanceTransfer ? "Ambulance" : "Other",
          ambtransfer: ambulanceTransfer,
          injury: injury ?? 0,

          rfv1: 1001,
          rfv2: 0,
          rfv3: 0,
          rfv_text: (document.getElementById("rfv1") as HTMLInputElement)?.value || "General complaint",
        }),
      })

      const visitData = await visitRes.json()

      // ==============================
      // 3️⃣ RUN TRIAGE
      // ==============================
      const triageRes = await fetch(
        `http://127.0.0.1:8000/triage/${visitData.id}`,
        { method: "POST" }
      )

      const triageData = await triageRes.json()

      setPrediction(triageData)

      alert("Patient Registered Successfully")
    } catch (err) {
      console.error(err)
      alert("Submission Failed")
    }

    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-background">
  
      <main className="ml-64 min-h-screen p-6">
        <h1 className="text-2xl font-semibold mb-6">Patient Intake Portal</h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Patient Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Patient Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 grid-cols-3">
              <Input id="name" placeholder="Full Name" />
              <Input id="age" type="number" placeholder="Age" />
              <Input id="phone" placeholder="Phone" />
              <Input id="email" placeholder="Email" />
            </CardContent>
          </Card>

          {/* Vitals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Vitals
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 grid-cols-3">
              <Input id="temp" type="number" placeholder="Temperature" />
              <Input id="pulse" type="number" placeholder="Pulse" />
              <Input id="respiration" type="number" placeholder="Respiration" />
              <Input id="bp-systolic" type="number" placeholder="Systolic BP" />
              <Input id="bp-diastolic" type="number" placeholder="Diastolic BP" />
              <Input id="pain" type="number" placeholder="Pain Scale" />
              <div className="space-y-2">
  <Label>Injury Severity</Label>

  <Select onValueChange={(value) => setInjury(Number(value))}>
    <SelectTrigger>
      <SelectValue placeholder="Select Injury Severity" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="0">No Injury</SelectItem>
      <SelectItem value="1">Minor</SelectItem>
      <SelectItem value="2">Moderate</SelectItem>
      <SelectItem value="3">Severe</SelectItem>
    </SelectContent>
  </Select>
</div>
              
            </CardContent>
          </Card>

          {/* Ambulance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ambulance className="h-5 w-5" />
                Transfer
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-between items-center">
              <Label>Ambulance Transfer</Label>
              <Switch
                checked={ambulanceTransfer}
                onCheckedChange={(checked) => setAmbulanceTransfer(checked)}
              />
            </CardContent>
          </Card>

          {/* RFV */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Reason for Visit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input id="rfv1" placeholder="Primary Reason" />
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Submit Patient Record"}
            </Button>
          </div>

          {/* Prediction Result */}
          {prediction && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Triage Result</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Badge variant={prediction.classification === "Critical" ? "destructive" : "secondary"}>
                  {prediction.classification}
                </Badge>
                <p>Risk Probability: {(prediction.risk_probability * 100).toFixed(2)}%</p>
                <p>Override Triggered: {prediction.override_triggered ? "Yes" : "No"}</p>
              </CardContent>
            </Card>
          )}

        </form>
      </main>
    </div>
  )
}