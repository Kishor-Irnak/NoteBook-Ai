"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
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
import { Loader2, BookOpen } from "lucide-react"
import Image from "next/image"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }
    setLoading(true)
    setError("")
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(userCredential.user, { displayName: name })
      router.push("/notebook")
    } catch (err: unknown) {
      setError((err as Error).message || "Failed to create account. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 border-none shadow-xl rounded-3xl">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleRegister} className="p-6 md:p-8 flex flex-col justify-center">
            <FieldGroup className="gap-5">
              <div className="flex flex-col items-center gap-2 text-center mb-1">
                <span className="brand-icon">
                  <BookOpen className="h-6 w-6" />
                </span>
                <h1 className="text-3xl font-bold tracking-tight">Create account</h1>
                <p className="text-sm text-balance text-muted-foreground">
                  Join Notebook AI to organize your thoughts
                </p>
              </div>
              <Field className="gap-1.5">
                <FieldLabel htmlFor="name" className="font-semibold text-gray-700">Full Name</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-10 rounded-xl bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
                  required
                />
              </Field>
              <Field className="gap-1.5">
                <FieldLabel htmlFor="email" className="font-semibold text-gray-700">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10 rounded-xl bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
                  required
                />
              </Field>
              <Field className="gap-1.5">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <FieldLabel htmlFor="password" className="font-semibold text-gray-700">Password</FieldLabel>
                    <Input 
                      id="password" 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-10 rounded-xl bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
                      required 
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <FieldLabel htmlFor="confirm-password" className="font-semibold text-gray-700">Confirm</FieldLabel>
                    <Input 
                      id="confirm-password" 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-10 rounded-xl bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
                      required 
                    />
                  </div>
                </div>
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
                  {loading ? "Creating account..." : "Get Started"}
                </Button>
              </Field>
              
              <FieldDescription className="text-center text-sm">
                Already have an account?{" "}
                <button 
                  type="button"
                  onClick={() => router.push("/login")}
                  className="brand-link"
                >
                  Sign in
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
