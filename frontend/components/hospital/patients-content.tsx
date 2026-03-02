// "use client"

// import { useEffect, useState } from "react"

// import { StatusBadge } from "@/components/hospital/status-badge"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Users } from "lucide-react"
// const [selectedVisit, setSelectedVisit] = useState<any | null>(null)
// const [showModal, setShowModal] = useState(false)
// const [prescriptions, setPrescriptions] = useState<any[]>([])

// export function PatientsContent() {
//   const [patients, setPatients] = useState<any[]>([])

//   useEffect(() => {
//     const fetchPatients = async () => {
//       const res = await fetch("http://127.0.0.1:8000/visits")
//       const data = await res.json()
//       setPatients(data)
//     }

//     fetchPatients()
//   }, [])

//   return (
//     <div className="min-h-screen bg-background">
      
//       <main className="ml-64 min-h-screen">
//         <header className="sticky top-0 z-30 border-b bg-card/80 backdrop-blur-sm">
//           <div className="flex h-16 items-center justify-between px-6">
//             <div>
//               <h1 className="text-2xl font-semibold tracking-tight">Patients</h1>
//               <p className="text-sm text-muted-foreground">Live patient records</p>
//             </div>
//           </div>
//         </header>

//         <div className="p-6">
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Users className="h-5 w-5 text-primary" />
//                 All Patients ({patients.length})
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               {patients.length === 0 ? (
//                 <p className="text-center text-muted-foreground py-8">
//                   No patients found
//                 </p>
//               ) : (
//                 <div className="space-y-4">
//                   {patients.map((p) => (
//                     <div
//                       key={p.id}
//                       className="flex justify-between rounded-lg border p-4"
//                     >
//                       <div>
//                         <p className="font-semibold">Visit ID: {p.id}</p>
//                         <p className="text-sm text-muted-foreground">
//                           Status: {p.status}
//                         </p>
//                       </div>

//                       <div>
//                         {p.classification && (
//                           <p className="font-semibold">
//                             {p.classification} (
//                             {(p.risk_probability * 100).toFixed(1)}%)
//                           </p>
//                         )}
//                       </div>

//                       <StatusBadge status={p.status} />
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </div>
//       </main>
//     </div>
//   )
// }

// "use client"

// import { useEffect, useState } from "react"

// import { StatusBadge } from "@/components/hospital/status-badge"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Users } from "lucide-react"

// export function PatientsContent() {
//   const BASE_URL = "http://127.0.0.1:8000"

//   const [patients, setPatients] = useState<any[]>([])
//   const [selectedVisit, setSelectedVisit] = useState<any | null>(null)
//   const [showModal, setShowModal] = useState(false)
//   const [prescriptions, setPrescriptions] = useState<any[]>([])

//   /* ================= FETCH VISITS ================= */

//   useEffect(() => {
//     const fetchPatients = async () => {
//       try {
//         const res = await fetch(`${BASE_URL}/visits`)
//         const data = await res.json()
//         setPatients(data)
//       } catch (error) {
//         console.error("Failed to fetch visits", error)
//       }
//     }

//     fetchPatients()
//   }, [])

//   /* ================= FETCH PRESCRIPTIONS ================= */

//   useEffect(() => {
//     if (!selectedVisit || !showModal) return

//     const fetchPrescriptions = async () => {
//       try {
//         const res = await fetch(
//           `${BASE_URL}/prescriptions/${selectedVisit.id}`
//         )
//         const data = await res.json()
//         setPrescriptions(data)
//       } catch (error) {
//         console.error("Failed to fetch prescriptions", error)
//       }
//     }

//     fetchPrescriptions()
//   }, [selectedVisit, showModal])

//   return (
//     <div className="min-h-screen bg-background">
//       <main className="ml-64 min-h-screen">
//         <header className="sticky top-0 z-30 border-b bg-card/80 backdrop-blur-sm">
//           <div className="flex h-16 items-center justify-between px-6">
//             <div>
//               <h1 className="text-2xl font-semibold tracking-tight">
//                 Patients
//               </h1>
//               <p className="text-sm text-muted-foreground">
//                 Live patient records
//               </p>
//             </div>
//           </div>
//         </header>

//         <div className="p-6">
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Users className="h-5 w-5 text-primary" />
//                 All Visits ({patients.length})
//               </CardTitle>
//             </CardHeader>

//             <CardContent>
//               {patients.length === 0 ? (
//                 <p className="text-center text-muted-foreground py-8">
//                   No patients found
//                 </p>
//               ) : (
//                 <div className="space-y-4">
//                   {patients.map((p) => (
//                     <div
//                       key={p.id}
//                       className="flex justify-between items-center rounded-lg border p-4"
//                     >
//                       <div>
//                         <p className="font-semibold">
//                           Visit ID: {p.id}
//                         </p>
//                         <p className="text-sm text-muted-foreground">
//                           Status: {p.status}
//                         </p>
//                       </div>

//                       <div className="text-right">
//                         {p.classification && (
//                           <p className="font-semibold">
//                             {p.classification} (
//                             {(p.risk_probability * 100).toFixed(1)}%)
//                           </p>
//                         )}

//                         {p.status === "COMPLETED" && (
//                           <button
//                             onClick={() => {
//                               setSelectedVisit(p)
//                               setShowModal(true)
//                             }}
//                             className="mt-2 text-sm text-primary underline"
//                           >
//                             View Prescriptions
//                           </button>
//                         )}
//                       </div>

//                       <StatusBadge status={p.status} />
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </div>
//       </main>

//       {/* ================= PRESCRIPTION MODAL ================= */}
"use client"

import { useEffect, useState } from "react"

import { StatusBadge } from "@/components/hospital/status-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"

export function PatientsContent() {
  const BASE_URL = "http://127.0.0.1:8000"

  const [patients, setPatients] = useState<any[]>([])
  const [selectedVisit, setSelectedVisit] = useState<any | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [prescriptions, setPrescriptions] = useState<any[]>([])

  /* ================= FETCH VISITS ================= */

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch(`${BASE_URL}/visits`)
        const data = await res.json()
        setPatients(data)
      } catch (error) {
        console.error("Failed to fetch visits", error)
      }
    }

    fetchPatients()
  }, [])

  /* ================= FETCH PRESCRIPTIONS ================= */

  useEffect(() => {
    if (!selectedVisit || !showModal) return

    const fetchPrescriptions = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/prescriptions/${selectedVisit.id}`
        )
        const data = await res.json()
        setPrescriptions(data)
      } catch (error) {
        console.error("Failed to fetch prescriptions", error)
      }
    }

    fetchPrescriptions()
  }, [selectedVisit, showModal])

  return (
    <div className="min-h-screen bg-background">
      <main className="ml-64 min-h-screen">
        <header className="sticky top-0 z-30 border-b bg-card/80 backdrop-blur-sm">
          <div className="flex h-16 items-center justify-between px-6">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                Patients
              </h1>
              <p className="text-sm text-muted-foreground">
                Live patient records
              </p>
            </div>
          </div>
        </header>

        <div className="p-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                All Visits ({patients.length})
              </CardTitle>
            </CardHeader>

            <CardContent>
              {patients.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No patients found
                </p>
              ) : (
                <div className="space-y-4">
                  {patients.map((p) => (
                    <div
                      key={p.id}
                      className="flex justify-between items-center rounded-lg border p-4"
                    >
                      <div>
                        <p className="font-semibold">
                          Visit ID: {p.id}
                          <span className="mx-2 text-muted-foreground">–</span>
                            {p.patient_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Status: {p.status}
                        </p>
                      </div>

                      <div className="text-right">
                        {p.classification && (
                          <p className="font-semibold">
                            {p.classification} (
                            {(p.risk_probability * 100).toFixed(1)}%)
                          </p>
                        )}

                        {p.status === "COMPLETED" && (
                          <button
                            onClick={() => {
                              setSelectedVisit(p)
                              setShowModal(true)
                            }}
                            className="mt-2 text-sm text-primary underline"
                          >
                            View Prescriptions
                          </button>
                        )}
                      </div>

                      <StatusBadge status={p.status} />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* ================= PRESCRIPTION MODAL ================= */}

      {showModal && selectedVisit && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

    <div className="bg-white w-[950px] max-h-[90vh] rounded-2xl p-8 relative flex flex-col">

      {/* CLOSE */}
      <button
        onClick={() => setShowModal(false)}
        className="absolute top-5 right-6 text-xl"
      >
        ×
      </button>

      {/* HEADER */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold">
          Prescription Record
        </h2>
        <p className="text-sm text-muted-foreground">
          Visit {selectedVisit.id} • Completed Consultation
        </p>
      </div>

      {/* SCROLLABLE CONTENT */}
      <div className="overflow-y-auto pr-3 space-y-8">

        {/* ================= PATIENT CREDENTIALS ================= */}
        <div className="bg-muted/20 rounded-xl p-6">

          <h3 className="text-lg font-semibold mb-6">
            Patient Details
          </h3>

          <div className="grid grid-cols-3 gap-y-6 gap-x-10 text-sm">

            <div>
              <p className="text-xs text-muted-foreground">Patient ID</p>
              <p className="font-medium">{selectedVisit.patient_id}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Name</p>
              <p className="font-medium">{selectedVisit.patient_name}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Gender</p>
              <p className="font-medium">{selectedVisit.gender}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Age</p>
              <p className="font-medium">{selectedVisit.age}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="font-medium">{selectedVisit.email}</p>
            </div>

          </div>
        </div>

        {/* ================= VITALS ================= */}
        <div className="bg-muted/20 rounded-xl p-6">

          <h3 className="text-lg font-semibold mb-6">
            Vitals & Symptoms
          </h3>

          <div className="grid grid-cols-3 gap-y-6 gap-x-10 text-sm">

            <div>
              <p className="text-xs text-muted-foreground">Temperature</p>
              <p className="font-medium">{selectedVisit.temperature} °F</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Pulse</p>
              <p className="font-medium">{selectedVisit.pulse} bpm</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Blood Pressure</p>
              <p className="font-medium">
                {selectedVisit.systolic_bp}/{selectedVisit.diastolic_bp} mmHg
              </p>
            </div>

            <div className="col-span-3">
              <p className="text-xs text-muted-foreground">Symptoms</p>
              <p className="font-medium">{selectedVisit.rfv_text}</p>
            </div>

          </div>
        </div>

        {/* ================= PRESCRIPTION TABLE ================= */}
        <div>

          <h3 className="text-lg font-semibold mb-4">
            Prescribed Medicines
          </h3>

          {prescriptions.length === 0 ? (
            <p className="text-muted-foreground">
              No prescriptions found
            </p>
          ) : (
            <div className="border rounded-xl p-4">

              {/* TABLE HEADER */}
              <div className="grid grid-cols-6 gap-4 mb-4 text-sm font-semibold border-b pb-2">
                <div>Medicine</div>
                <div>Dosage/Day</div>
                <div>Tabs/Dose</div>
                <div>Start</div>
                <div>End</div>
                <div>Status</div>
              </div>

              {/* TABLE BODY */}
              {prescriptions.map((pr) => (
                <div
                  key={pr.id}
                  className="grid grid-cols-6 gap-4 text-sm py-3 border-b last:border-none"
                >
                  <div className="font-medium">
                    {pr.medicine_name}
                  </div>

                  <div>{pr.dosage_per_day}</div>

                  <div>{pr.tablets_per_dose}</div>

                  <div>{pr.start_date}</div>

                  <div>{pr.end_date}</div>

                  <div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        pr.status === "ACTIVE"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {pr.status}
                    </span>
                  </div>
                </div>
              ))}

            </div>
          )}

        </div>

      </div>

    </div>
  </div>
)}
    </div>
  )
}
      