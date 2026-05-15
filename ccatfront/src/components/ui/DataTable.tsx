'use client'
import { useState, useMemo } from 'react'
import { ChevronUp, ChevronDown, Search, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react'

export interface Column<T> {
  key: string
  header: string
  render?: (row: T) => React.ReactNode
  sortable?: boolean
  className?: string
}

interface DataTableProps<T extends object> {
  data: T[]
  columns: Column<T>[]
  searchable?: boolean
  searchPlaceholder?: string
  pageSize?: number
  emptyMessage?: string
  toolbar?: React.ReactNode
}

function PagBtn({ onClick, disabled, children }: { onClick: () => void; disabled: boolean; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
    >
      {children}
    </button>
  )
}

export function DataTable<T extends object>({
  data,
  columns,
  searchable = true,
  searchPlaceholder = 'Rechercher…',
  pageSize = 10,
  emptyMessage = 'Aucune donnée.',
  toolbar,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<{ key: string; asc: boolean } | null>(null)
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    let rows = data
    if (search.trim()) {
      const q = search.toLowerCase()
      rows = rows.filter(row =>
        Object.values(row as Record<string, unknown>).some(v => String(v ?? '').toLowerCase().includes(q))
      )
    }
    if (sort) {
      rows = [...rows].sort((a, b) => {
        const av = String((a as Record<string, unknown>)[sort.key] ?? '')
        const bv = String((b as Record<string, unknown>)[sort.key] ?? '')
        return sort.asc
          ? av.localeCompare(bv, undefined, { numeric: true })
          : bv.localeCompare(av, undefined, { numeric: true })
      })
    }
    return rows
  }, [data, search, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const toggleSort = (key: string) => {
    setSort(s => s?.key === key ? { key, asc: !s.asc } : { key, asc: true })
    setPage(1)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      {(searchable || toolbar) && (
        <div className="px-5 py-3.5 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {searchable && (
            <div className="relative w-full sm:max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1) }}
                placeholder={searchPlaceholder}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
              />
            </div>
          )}
          <div className="flex items-center gap-3 ml-auto">
            <span className="text-xs text-gray-400 whitespace-nowrap">{filtered.length} résultat(s)</span>
            {toolbar}
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] text-gray-400 bg-gray-50/80 border-b border-gray-100">
              {columns.map(col => (
                <th
                  key={col.key}
                  className={`text-left font-semibold px-4 py-3 ${col.sortable ? 'cursor-pointer select-none hover:text-gray-700' : ''} ${col.className ?? ''}`}
                  onClick={col.sortable ? () => toggleSort(col.key) : undefined}
                >
                  <div className="flex items-center gap-1">
                    {col.header}
                    {col.sortable && (
                      <span className="flex flex-col -space-y-0.5">
                        <ChevronUp size={10} className={sort?.key === col.key && sort.asc ? 'text-blue-600' : 'text-gray-300'} />
                        <ChevronDown size={10} className={sort?.key === col.key && !sort.asc ? 'text-blue-600' : 'text-gray-300'} />
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {paged.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center text-sm text-gray-400 py-14">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paged.map((row, i) => (
                <tr key={i} className="hover:bg-blue-50/20 transition-colors">
                  {columns.map(col => (
                    <td key={col.key} className={`px-4 py-3 ${col.className ?? ''}`}>
                      {col.render
                        ? col.render(row)
                        : String((row as Record<string, unknown>)[col.key] ?? '—')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-400">Page {currentPage} / {totalPages}</span>
          <div className="flex items-center gap-1">
            <PagBtn onClick={() => setPage(1)} disabled={currentPage === 1}><ChevronsLeft size={14} /></PagBtn>
            <PagBtn onClick={() => setPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}><ChevronLeft size={14} /></PagBtn>
            <PagBtn onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}><ChevronRight size={14} /></PagBtn>
            <PagBtn onClick={() => setPage(totalPages)} disabled={currentPage === totalPages}><ChevronsRight size={14} /></PagBtn>
          </div>
        </div>
      )}
    </div>
  )
}
