import PulseClient from "./pulse_client"
import { Suspense } from "react"

export const metadata = {
  title: "zTube Pulse",
  description: "View Short Videos with zTube Pulse",
}

export default function PAGE() {
  return (
    <div className="overscroll-none" >
      <Suspense fallback={<div>loading pulses</div>} >
        <PulseClient />
      </Suspense>
    </div>
  )
}