"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Loader2, Eye, EyeOff, Lock } from "lucide-react"
import axios, { AxiosError } from "axios"

import { resetPasswordSchema } from "@/schemas/signInSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

// shadcn/ui components
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const Page = () => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const { toast } = useToast()
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get('token')

}
