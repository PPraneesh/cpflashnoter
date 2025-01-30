import { useEffect, useState } from 'react'

export const PWAInstaller = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsVisible(true)
    }
    
    window.addEventListener('beforeinstallprompt', handler)
    
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const install = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      console.log('User accepted install')
    }
    setIsVisible(false)
  }

  if (!isVisible) return null

return (
    <div className="fixed bottom-18 right-6 bg-neutral-800 p-4 rounded-lg border border-neutral-700/30 hover:border-neutral-600/50 transition-all shadow-lg z-50">
        <p className="text-white">Install this app for a better experience!</p>
        <div className="mt-3 flex gap-3">
            <button 
                onClick={install}
                className="px-4 py-1 rounded-md bg-yellow-500 hover:bg-yellow-400 text-white transition-colors cursor-pointer flex-1"
            >
                Install
            </button>
            <button 
                onClick={() => setIsVisible(false)}
                className="px-4 py-1 rounded-md bg-neutral-700 hover:bg-neutral-600 text-neutral-400 transition-colors cursor-pointer flex-1"
            >
                Close
            </button>
        </div>
    </div>
)
}