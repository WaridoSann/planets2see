import { Orbit } from 'lucide-react'
import { bodies, type BodyId } from '../data/bodies'

export default function PlanetNavigation({ selected, intro, onSelect, onOverview }: { selected: BodyId | null; intro: boolean; onSelect: (id: BodyId) => void; onOverview: () => void }) {
  return <nav className="planet-navigation" aria-label="Navigation du système solaire">
    <button className={`overview-button ${!selected && !intro ? 'selected' : ''}`} onClick={onOverview} aria-label="Vue d’ensemble" title="Vue d’ensemble (Échap)"><Orbit size={21} /><span>Ensemble</span></button>
    <span className="nav-separator" />
    <div className="planet-list">{bodies.map((body, i) => <button key={body.id} onClick={() => onSelect(body.id)} aria-label={`Explorer ${body.name}`} aria-pressed={!intro && selected === body.id} className={`planet-button ${!intro && selected === body.id ? 'selected' : ''}`}>
      <span className={`planet-preview ${body.id}`} style={{ '--planet-color': body.color } as React.CSSProperties} />
      <span>{body.name}</span><small>{String(i).padStart(2, '0')}</small>
    </button>)}</div>
  </nav>
}
