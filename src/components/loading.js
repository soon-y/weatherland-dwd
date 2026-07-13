"use client"

import { Sun } from '@/components/icons/sun'
import { Html } from '@react-three/drei'

export default function Loading() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-0 min-w-50">
        <Sun className="w-20 h-20" />
        <span className='text-[#ffcf00] font-semibol text-center text-base/5'>Preparing environment...</span>
      </div>
    </Html>
  )
}