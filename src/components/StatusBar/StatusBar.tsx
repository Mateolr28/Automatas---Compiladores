// src/components/StatusBar/StatusBar.tsx
import { CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';
import { StatusMessage } from '../../types/automata.types';

interface Props {
  status: StatusMessage;
}

export default function StatusBar({ status }: Props) {
  if (status.type === 'idle' || !status.text) {
    return null;
  }

  // Estilos y de iconos para cada tipo de mensaje
  const config = {
    ok: {
      bg: 'bg-[#183526]/80 text-[#22c55e] border-[#22c55e]/30',
      icon: <CheckCircle2 className="w-4 h-4 shrink-0" />,
    },
    warn: {
      bg: 'bg-[#3d301a]/80 text-[#f59e0b] border-[#f59e0b]/30',
      icon: <AlertTriangle className="w-4 h-4 shrink-0" />,
    },
    error: {
      bg: 'bg-red-950/50 text-red-400 border-red-900/40',
      icon: <XCircle className="w-4 h-4 shrink-0" />,
    },
    info: {
      bg: 'bg-[#1e2d42]/80 text-[#4f8ef7] border-[#4f8ef7]/30',
      icon: <Info className="w-4 h-4 shrink-0" />,
    },
  }[status.type];

  return (
    <div
      id="status-bar-container"
      className={`flex items-start gap-2.5 px-4 py-3 rounded-md text-xs border leading-relaxed ${config.bg} font-sans`}
    >
      {config.icon}
      <span className="font-medium font-sans">{status.text}</span>
    </div>
  );
}
