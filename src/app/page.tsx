import HomePage from "./home"
import { Suspense } from "react"

export default function Home() {
  return (
    <Suspense fallback={<div>loading home...</div>} >
      <HomePage />
    </Suspense>
  );
}