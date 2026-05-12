'use client'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
}

interface FAQAccordionProps {
  items: FAQItem[]
}

export default function FAQAccordion({ items }: FAQAccordionProps) {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div className="divide-y divide-gray-200 border border-gray-200 rounded-xl overflow-hidden">
      {items.map((item, i) => (
        <div key={i}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors"
          >
            {item.question}
            <ChevronDown
              size={18}
              className={`shrink-0 text-gray-400 transition-transform ${open === i ? 'rotate-180' : ''}`}
            />
          </button>
          {open === i && (
            <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
