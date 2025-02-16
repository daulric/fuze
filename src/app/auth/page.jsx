import { Suspense } from "react"
import AuthPage from "./auth"

export const metadata = {
    title: "Authentication"
}

export default function PAGE() {
    return (
      <Suspense fallback={<div>loading authentication...</div>} >
          <AuthPage />
      </Suspense>
    )
}