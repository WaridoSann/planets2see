import { useEffect, useRef } from 'react'
import { ExternalLink, SlidersHorizontal, X } from 'lucide-react'
import type { Quality, ResolvedQuality } from '../lib/simulation'

interface Props {
  quality: Quality; resolved: ResolvedQuality; setQuality: (value: Quality) => void
  labels: boolean; setLabels: (value: boolean) => void; skipIntro: boolean; setSkipIntro: (value: boolean) => void
  reducedMotion: boolean; onClose: () => void
}
export default function Settings({ quality, resolved, setQuality, labels, setLabels, skipIntro, setSkipIntro, reducedMotion, onClose }: Props) {
  const dialog = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const element = dialog.current
    element?.showModal()
    return () => element?.close()
  }, [])
  const names = { low: 'Éco', medium: 'Équilibrée', high: 'Élevée' }
  return <dialog ref={dialog} className="settings-dialog" onCancel={onClose} onClick={e => { if (e.target === dialog.current) onClose() }} aria-labelledby="settings-title">
    <div className="settings-content"><div className="panel-top"><SlidersHorizontal size={19} /><button className="icon-button" aria-label="Fermer les réglages" onClick={onClose}><X size={18} /></button></div>
      <h2 id="settings-title">À votre mesure.</h2><p>Ajustez votre fenêtre sur l’univers.</p>
      <label className="setting-label" htmlFor="quality">Qualité graphique</label>
      <select id="quality" value={quality} onChange={e => setQuality(e.target.value as Quality)}><option value="auto">Automatique · {names[resolved]}</option><option value="low">Éco · textures 1K, sans bloom</option><option value="medium">Équilibrée · textures 1K</option><option value="high">Élevée · textures 2K au premier plan</option></select>
      <p className="setting-help">Le mode automatique privilégie la fluidité selon l’appareil. La qualité élevée augmente la résolution du rendu et des textures de l’astre sélectionné.</p>
      <label className="toggle-row"><span>Afficher les noms des astres</span><input type="checkbox" checked={labels} onChange={e => setLabels(e.target.checked)} /></label>
      <label className="toggle-row"><span>Accéder directement à l’exploration</span><input type="checkbox" checked={skipIntro} onChange={e => setSkipIntro(e.target.checked)} /></label>
      <p className="motion-note">{reducedMotion ? 'Mouvements réduits activés : transitions immédiates et simulation initialement en pause.' : 'La préférence « Réduire les animations » de votre système est respectée.'}</p>
      <div className="settings-about"><span>UNE EXPLORATION LIBRE & DOCUMENTÉE</span><p>Tailles, distances et vitesses adaptées à la lisibilité. Positions illustratives, sans calcul d’éphémérides.</p><a href="https://www.solarsystemscope.com/textures/" target="_blank" rel="noreferrer">Textures : Solar System Scope · CC BY 4.0 <ExternalLink size={12} /></a><a href="https://github.com/WaridoSann/planets2see" target="_blank" rel="noreferrer">Code source & crédits <ExternalLink size={12} /></a></div>
    </div>
  </dialog>
}
