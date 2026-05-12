'use client'
import { Activity, BarChart2, X, Mail } from 'lucide-react'
import { useI18n } from '@/context/I18nContext'

export default function Footer() {
  const { t } = useI18n()
  const f = t.footer
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1 flex flex-col gap-4">
            <a href="/" className="flex items-center gap-2 font-bold text-gray-900">
              <Activity size={20} className="text-blue-600" />
              CCAT Pro
            </a>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">{f.tagline}</p>
            <div className="flex gap-3 text-gray-400">
              <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 hover:text-gray-600 transition-colors">
                <BarChart2 size={17} />
              </button>
              <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 hover:text-gray-600 transition-colors">
                <X size={17} />
              </button>
              <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 hover:text-gray-600 transition-colors">
                <Mail size={17} />
              </button>
            </div>
          </div>

          {/* Link columns */}
          {[f.product, f.resources, f.company].map((col) => (
            <div key={col.title}>
              <h4 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm">{col.title}</h4>
              <ul className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors min-h-[36px] flex items-center">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
          <span>{f.copyright}</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-700 min-h-[36px] flex items-center">{f.terms}</a>
            <a href="#" className="hover:text-gray-700 min-h-[36px] flex items-center">{f.privacy}</a>
            <a href="#" className="hover:text-gray-700 min-h-[36px] flex items-center">{f.cookies}</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
