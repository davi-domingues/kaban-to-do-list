import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import OAuthButtons from './OAuthButtons'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [message, setMessage] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setMessage(null)

    if (!email || !password) {
      setMessage('Preencha email e senha.')
      return
    }

    const action =
      mode === 'login'
        ? supabase.auth.signInWithPassword({ email, password })
        : supabase.auth.signUp({ email, password })

    const { error } = await action

    if (error) {
      setMessage(error.message)
    } else if (mode === 'register') {
      setMessage('Conta criada. Verifique seu email, se necessario.')
    }
  }

  return (
    <div className="auth-card">
      <h2>{mode === 'login' ? 'Entrar' : 'Criar conta'}</h2>
      <p>Use email e senha para entrar.</p>

      <form onSubmit={handleSubmit} className="auth-form">
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <label>
          Senha
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        <button className="primary" type="submit">
          {mode === 'login' ? 'Entrar' : 'Cadastrar'}
        </button>
      </form>

      {message ? <p className="auth-message">{message}</p> : null}

      <OAuthButtons />

      <button
        className="link"
        type="button"
        onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
      >
        {mode === 'login'
          ? 'Nao tem conta? Criar agora.'
          : 'Ja tem conta? Entrar.'}
      </button>
    </div>
  )
}
