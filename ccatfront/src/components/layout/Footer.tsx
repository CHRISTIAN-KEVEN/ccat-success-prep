'use client'
import { Activity, BarChart2, X, Mail } from 'lucide-react'
import { useI18n } from '@/context/I18nContext'

export default function Footer() {
  const { t } = useI18n()
  const f = t.footer
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="flex flex-col gap-4">
            <a href="/" className="flex items-center gap-2 font-bold text-gray-900">
              <Activity size={20} className="text-blue-600" />
              CCAT Pro
            </a>
            <p className="text-sm text-gray-500 leading-relaxed">{f.tagline}</p>
            <div className="flex gap-3 text-gray-400">
              <BarChart2 size={18} className="hover:text-gray-600 cursor-pointer" />
              <X size={18} className="hover:text-gray-600 cursor-pointer" />
              <Mail size={18} className="hover:text-gray-600 cursor-pointer" />
            </div>
          </div>
          {[f.product, f.resources, f.company].map((col) => (
            <div key={col.title}>
              <h4 className="font-semibold text-gray-900 mb-4">{col.title}</h4>
              <ul className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-400">
          <span>{f.copyright}</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-700">{f.terms}</a>
            <a href="#" className="hover:text-gray-700">{f.privacy}</a>
            <a href="#" className="hover:text-gray-700">{f.cookies}</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
