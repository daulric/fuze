import PulseClientPWA from "./PWAController"
import { Suspense } from "react"

export const metadata = {
  title: "zTube Pulse",
  description: "View Short Videos with zTube Pulse",
}

export default function PAGE() {
  return <><PulseClientPWA /></>
}