'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { login } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AuthPanel } from '@/components/auth/auth-panel'
import { PasswordInput } from '@/components/auth/password-input'
import { Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, null)

  return (
    <div className="min-h-screen flex">
      <AuthPanel />

      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Bem-vindo de volta</h2>
            <p className="text-sm text-slate-500 mt-1.5">Entre com sua conta para continuar</p>
          </div>

          <form action={action} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email" className="text-slate-700 font-medium text-sm">E-mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="voce@empresa.com"
                required
                autoComplete="email"
                className="h-11 text-sm transition-shadow focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-400"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password" className="text-slate-700 font-medium text-sm">Senha</Label>
              <PasswordInput
                id="password"
                name="password"
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="h-11 text-sm transition-shadow focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-400"
              />
            </div>

            {state?.error && (
              <div className="flex items-start gap-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 animate-in fade-in duration-200">
                <span className="mt-0.5">⚠</span>
                {state.error}
              </div>
            )}

            <Button
              type="submit"
              disabled={pending}
              className="h-11 w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold rounded-xl transition-all duration-150 shadow-sm hover:shadow-md"
            >
              {pending ? <><Loader2 className="size-4 animate-spin mr-2" />Entrando…</> : 'Entrar'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              Não tem conta?{' '}
              <Link href="/register" className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
                Criar conta
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
