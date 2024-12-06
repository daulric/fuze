import Link from 'next/link'
import { Home, Video, BarChart2, Settings, StepBack } from 'lucide-react'

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-800 text-gray-100 p-4 hidden md:block">
      <div className="flex items-center mb-6">
        <Video className="h-6 w-6 mr-2" />
        <span className="text-lg font-bold">zTube Studio</span>
      </div>
      <nav>
        <ul className="space-y-2">
          <li>
            <Link href="/dashboard" className="flex items-center p-2 rounded-lg hover:bg-gray-700">
              <Home className="h-5 w-5 mr-3" />
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/dashboard/content" className="flex items-center p-2 rounded-lg hover:bg-gray-700">
              <Video className="h-5 w-5 mr-3" />
              Content
            </Link>
          </li>
          <li>
            <Link href="/dashboard/analytics" className="flex items-center p-2 rounded-lg hover:bg-gray-700">
              <BarChart2 className="h-5 w-5 mr-3" />
              Analytics
            </Link>
          </li>
          <li>
            <Link href="/dashboard/settings" className="flex items-center p-2 rounded-lg hover:bg-gray-700">
              <Settings className="h-5 w-5 mr-3" />
              Settings
            </Link>
          </li>

          <li>
            <Link href="/" className="flex items-center p-2 rounded-lg hover:bg-gray-700">
              <StepBack className="h-5 w-5 mr-3" />
              Home
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar

