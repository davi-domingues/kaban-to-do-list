import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../auth/AuthProvider'

export default function AccountMenu() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)

  async function handleLogout() {
    await supabase.auth.signOut()
  }

  async function handleDeleteAccount() {
    if (!confirm('Apagar conta e todos os dados?')) return
    alert('Apagar conta vira feature futura. No MVP, use o painel do Supabase.')
  }

  return (
    <div className="account-menu">
      <button className="avatar" onClick={() => setOpen((prev) => !prev)}>
        {user?.email?.slice(0, 2).toUpperCase() ?? 'DD'}
      </button>
      {open ? (
        <div className="account-dropdown">
          <p className="account-email">{user?.email}</p>
          <button className="ghost" type="button">
            Editar perfil (futuro)
          </button>
          <button className="ghost" type="button" onClick={handleLogout}>
            Sair
          </button>
          <button className="ghost danger" type="button" onClick={handleDeleteAccount}>
            Apagar conta
          </button>
        </div>
      ) : null}
    </div>
  )
}
