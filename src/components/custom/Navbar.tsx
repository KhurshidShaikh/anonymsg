"use client"
import { Button } from '../ui/button'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { User } from 'next-auth'
import { signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import * as React from "react"
import { Moon, MoonIcon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


const Navbar = () => {
  const {data:session}=useSession()
  const { setTheme } = useTheme()

  const user:User=session?.user as User
  const pathname=usePathname()
  const isUserRoute = /^\/u\/[^/]+$/.test(pathname)
  
  return (
    <div className={`${isUserRoute?' hidden':'sticky top-0 right-0 w-full z-50 bg-background   overflow-x-hidden'}`}>
      <nav className="shadow-md p-4">
        <div className="container relative mx-auto flex justify-between items-center">
          {session?(
            <>
              <div className="text-2xl font-bold">AnonyMsg </div>

              <div className="text-xl font-bold hidden md:block">Welcome,{user?.username}</div>
              
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild className='z-50'>
                    <Button variant="outline" size="icon">
                      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                      <span className="sr-only">Toggle theme</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[8rem]">
                    <DropdownMenuItem onClick={() => setTheme("light")}>
                      Light
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                      Dark
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("system")}>
                      System
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button variant="default" onClick={()=>signOut({ callbackUrl: 'http://localhost:3000' })}>
                  Logout
                </Button>
              </div>
            </>
          ):(
            <>
              <div className="text-2xl font-bold">AnonyMsg </div>

              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                      <span className="sr-only">Toggle theme</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[8rem]">
                    <DropdownMenuItem onClick={() => setTheme("light")}>
                      Light
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                      Dark
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("system")}>
                      System
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Link href={"/sign-in"}>
                  <Button variant="default">Login</Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </nav>
    </div>
  )
}

export default Navbar
