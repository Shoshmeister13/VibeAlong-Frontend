"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface AnimatedCardProps {
  title: string
  description?: string
  children: ReactNode
  delay?: number
  className?: string
}

export function AnimatedCard({ title, description, children, delay = 0, className = "" }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className={className}
    >
      <Card className="w-full overflow-hidden border-2 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
          <CardTitle className="text-3xl font-bold text-black">{title}</CardTitle>
          {description && <CardDescription className="text-gray-600">{description}</CardDescription>}
        </CardHeader>
        <CardContent className="p-6">{children}</CardContent>
      </Card>
    </motion.div>
  )
}
