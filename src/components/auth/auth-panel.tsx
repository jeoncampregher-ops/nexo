import { BarChart3, Kanban, TrendingUp } from 'lucide-react'
import { NexoLogo } from '@/components/brand/logo'

const FEATURES = [
  {
    icon: Kanban,
    title: 'Kanban com arrastar e soltar',
    desc: 'Mova projetos e pedidos entre etapas com fluidez.',
  },
  {
    icon: BarChart3,
    title: 'Dashboard em tempo real',
    desc: 'Lead time, throughput e status de toda a esteira.',
  },
  {
    icon: TrendingUp,
    title: 'ROI calculado automaticamente',
    desc: 'Cada pedido traz o retorno estimado na abertura.',
  },
]

const METRICS = [
  { label: 'Projetos ativos', value: '24' },
  { label: 'ROI total', value: 'R$ 2,4M' },
  { label: 'Lead time médio', value: '12d' },
]

export function AuthPanel() {
  return (
    <div className="hidden lg:flex w-[52%] flex-col relative overflow-hidden bg-slate-950">
      {/* Gradient blobs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-20 w-80 h-80 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 left-1/3 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Dot grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative z-10 flex flex-col h-full px-12 py-10">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <NexoLogo size={36} />
          <span className="text-lg font-bold text-white tracking-tight">Nexo</span>
        </div>

        {/* Hero text */}
        <div className="mt-auto mb-10">
          <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-4">
            Gestão de projetos
          </p>
          <h1 className="text-4xl font-bold text-white leading-tight tracking-tight">
            Da ideia ao deploy,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
              tudo em um nexo.
            </span>
          </h1>
          <p className="mt-4 text-slate-400 text-base leading-relaxed max-w-md">
            Visibilidade total da esteira de desenvolvimento, do backlog ao entregue, com ROI e métricas automáticas.
          </p>

          {/* Features */}
          <ul className="mt-8 flex flex-col gap-5">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <li key={title} className="flex items-start gap-4">
                <div className="size-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon className="size-4 text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Metrics card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
          <p className="text-xs text-slate-500 font-medium mb-4 uppercase tracking-wider">Visão geral agora</p>
          <div className="grid grid-cols-3 gap-4">
            {METRICS.map(({ label, value }) => (
              <div key={label}>
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-xs text-slate-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
          {/* Fake mini bar chart */}
          <div className="mt-4 flex items-end gap-1.5 h-10">
            {[40, 65, 50, 80, 60, 90, 75, 95].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm bg-indigo-500/40"
                style={{ height: `${h}%`, opacity: 0.4 + i * 0.07 }}
              />
            ))}
          </div>
          <p className="text-[10px] text-slate-600 mt-2">Throughput — últimas 8 semanas</p>
        </div>
      </div>
    </div>
  )
}
