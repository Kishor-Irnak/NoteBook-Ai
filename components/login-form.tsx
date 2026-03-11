"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import Image from "next/image"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push("/notebook")
    } catch (err: unknown) {
      setError((err as Error).message || "Failed to login. Please check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 border-none shadow-xl rounded-3xl">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleLogin} className="p-6 md:p-8 flex flex-col justify-center">
            <FieldGroup className="gap-6">
              <div className="flex flex-col items-center gap-2 text-center mb-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F2EFE9] border-2 border-[#1A261D] hard-shadow relative overflow-hidden">
            <Image 
              src="https://i.postimg.cc/TwNwrGCT/n-removebg-preview.png" 
              alt="Logo" 
              fill 
              className="object-contain p-1.5"
            />
          </div>
                <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
                <p className="text-balance text-muted-foreground text-sm">
                  Login to your Notebook AI account
                </p>
              </div>
              <Field className="gap-2">
                <FieldLabel htmlFor="email" className="font-semibold text-gray-700">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 rounded-xl bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
                  required
                />
              </Field>
              <Field className="gap-2">
                <div className="flex items-center">
                  <FieldLabel htmlFor="password" className="font-semibold text-gray-700">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto text-xs font-medium text-rose-600 underline-offset-4 hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 rounded-xl bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
                  required 
                />
              </Field>

              {error && (
                <p className="rounded-lg bg-red-50 p-2 text-center text-xs font-medium text-red-600">
                  {error}
                </p>
              )}

              <Field>
                <Button 
                  type="submit" 
                  className="brand-button"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </Field>
              
              <FieldDescription className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <button 
                  type="button"
                  onClick={() => router.push("/register")}
                  className="brand-link"
                >
                  Register
                </button>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="relative hidden bg-muted md:block overflow-hidden">
            <Image
              src="/bg-login.jpg"
              alt="Image"
              fill
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center text-[11px] text-gray-400">
        By clicking continue, you agree to our <a href="#" className="underline">Terms of Service</a>{" "}
        and <a href="#" className="underline">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}
