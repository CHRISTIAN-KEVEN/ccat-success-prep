'use client'
import { CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { useI18n } from '@/context/I18nContext'
import { motion } from '@/components/ui/Motion'

function DashboardMockup({ d }: { d: { label: string; percentile: string; verbal: string; numerical: string; spatial: string } }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-5 w-full max-w-xs sm:max-w-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
        <div className="flex-1 bg-gray-100 rounded text-[10px] text-gray-400 px-2 py-0.5 ml-2 truncate">
          ccatpro.app/dashboard/analytics
        </div>
      </div>
      <p className="text-[10px] text-gray-400 uppercase tracking-wide">{d.label}</p>
      <div className="flex items-end gap-3 mt-1 mb-4">
        <p className="text-xl font-bold text-gray-900">{d.percentile}</p>
        <div className="flex items-end gap-1 mb-0.5">
          {[40, 60, 75, 90].map((h, i) => (
            <motion.div
              key={i}
              className="w-2.5 bg-blue-500 rounded-sm"
              initial={{ height: 0 }}
              whileInView={{ height: h / 4 + 'px' }}
              transition={{ delay: 0.6 + i * 0.1, duration: 0.5, ease: 'easeOut' }}
              viewport={{ once: true }}
            />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[d.verbal, d.numerical, d.spatial].map((label, i) => (
          <div key={i} className="bg-gray-50 rounded-lg p-2">
            <p className="text-[10px] text-gray-500 mb-1.5">{label}</p>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-blue-500 rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: [75, 60, 80][i] + '%' }}
                transition={{ delay: 0.8 + i * 0.12, duration: 0.6, ease: 'easeOut' }}
                viewport={{ once: true }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const companyLogos = ['Vista', 'Amazon', 'Crossover', 'Fintech', 'Corp']

export default function HeroSection() {
  const { t } = useI18n()
  const h = t.hero
  return (
    <section className="bg-white py-12 sm:py-16 lg:py-24 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text — staggered entrance */}
          <div className="flex flex-col gap-5 text-center lg:text-left items-center lg:items-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <Badge variant="announcement">{h.badge}</Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-gray-900"
            >
              {h.title1}{' '}
              <span className="text-blue-600">{h.titleHighlight}</span>
              {h.title2 ? ' ' + h.title2 : ''}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
              className="text-base sm:text-lg text-gray-500 leading-relaxed max-w-md"
            >
              {h.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
              className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto"
            >
              <Link href="/login" className="w-full sm:w-auto">
                <Button variant="primary" className="w-full sm:w-auto text-sm sm:text-base px-6 py-3 min-h-[48px]">
                  {h.ctaPrimary}
                </Button>
              </Link>
              <Button variant="outline" className="w-full sm:w-auto text-sm sm:text-base px-6 py-3 min-h-[48px]">
                {h.ctaSecondary}
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm text-gray-500"
            >
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-gray-400" />{h.trustNoCreditCard}
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-gray-400" />{h.trustFreeTrial}
              </span>
            </motion.div>
          </div>

          {/* Mockup — slide in from right */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="hidden sm:flex justify-center lg:justify-end"
          >
            <DashboardMockup d={h.dashboard} />
          </motion.div>
        </div>

        {/* Social proof — fade up on scroll */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mt-12 lg:mt-16 text-center"
        >
          <p className="text-[10px] sm:text-xs font-semibold text-gray-400 tracking-widest mb-5">{h.socialProof}</p>
          <div className="flex items-center justify-center gap-6 sm:gap-10 flex-wrap">
            {companyLogos.map((name, i) => (
              <motion.span
                key={name}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
                className="text-gray-300 font-bold text-base sm:text-lg"
              >
                {name}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
