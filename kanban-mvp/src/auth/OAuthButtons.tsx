import { supabase } from '../lib/supabaseClient'

const providers = [
  { id: 'google', label: 'Google' },
  { id: 'azure', label: 'Microsoft' },
]

export default function OAuthButtons() {
  return (
    <div className="oauth-buttons">
      {providers.map((provider) => (
        <button
          key={provider.id}
          type="button"
          className="ghost"
          onClick={() =>
            supabase.auth.signInWithOAuth({
              provider: provider.id as 'google' | 'azure',
            })
          }
        >
          Entrar com {provider.label}
        </button>
      ))}
    </div>
  )
}
