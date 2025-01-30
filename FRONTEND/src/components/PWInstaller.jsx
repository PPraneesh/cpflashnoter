import { useEffect, useState, useContext } from 'react'
// import NotificationToggle from './NotificationToggle'
// import { UserContext } from "../context/UserContext";

export const PWAInstaller = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isVisible, setIsVisible] = useState(false)
  const [timeLeft, setTimeLeft] = useState(20)
  // const {userData} = useContext(UserContext);
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsVisible(true)  
      setTimeLeft(20) // Reset timer when shown
    }
    
    window.addEventListener('beforeinstallprompt', handler)
    
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsVisible(false)
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isVisible])

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

  const progressWidth = `${(((20-timeLeft) / 20)) * 100}%`

  return (<>
    <div className="fixed bottom-18 right-6 z-50">
        <div className='bg-neutral-800 p-4 rounded-lg border border-neutral-600/50 transition-all shadow-lg'>
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
                  className="relative px-4 py-1 rounded-md bg-neutral-700 text-neutral-400 transition-colors cursor-pointer flex-1 overflow-hidden"
              >
                  <span className="relative z-10 text-white">Close</span>
                  <div
                      className="absolute left-0 top-0 h-full bg-red-500 transition-all duration-1000"
                      style={{ width: progressWidth }}
                  />
              </button>
          </div>

        </div>
    </div>
    </>
    )
}