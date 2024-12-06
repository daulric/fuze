import { Bell, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

const Header = () => {
  return (
    <header className="bg-gray-800 text-gray-100 p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Dashboard</h1>
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="text-gray-100 hover:text-gray-300">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-100 hover:text-gray-300">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
}

export default Header