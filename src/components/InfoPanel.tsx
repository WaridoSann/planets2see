import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ArrowDownRight, ArrowUpRight, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { bodies, DATA_REVIEW_DATE, FACT_SHEET, type Body } from '../data/bodies'

export default function InfoPanel({ body, reducedMotion, onClose, onPrevious, onNext }: { body: Body; reducedMotion: boolean; onClose: () => void; onPrevious: () => void; onNext: () => void }) {
  const panel = useRef<HTMLElement>(null)
  const scroll = useRef<HTMLDivElement>(null)
  useEffect(() => {
    scroll.current?.scrollTo(0, 0)
    const context = gsap.context(() => {
      gsap.fromTo(panel.current, { opacity: 0, x: reducedMotion ? 0 : 22 }, { opacity: 1, x: 0, duration: reducedMotion ? 0 : .5, ease: 'power2.out' })
    }, panel)
    return () => context.revert()
  }, [body.id, reducedMotion])
  const index = bodies.findIndex(item => item.id === body.id)
  const stats = [
    ['Diamètre équatorial', body.diameter], ['Masse', body.mass], ['Distance au Soleil', body.distance],
    ['Rotation sidérale', body.rotation], ['Période orbitale', body.revolution],
  ]
  return <aside className="info-panel" ref={panel} aria-label={`Fiche de ${body.name}`}>
    <div className="panel-top"><span className="eyebrow">CARNET D’EXPLORATION</span><button className="icon-button" onClick={onClose} aria-label="Fermer la fiche"><X size={17} /></button></div>
    <div className="panel-scroll" ref={scroll}>
      <div className="planet-heading"><span className="planet-number">{String(index).padStart(2, '0')} / 08</span><span className="category"><i style={{ background: body.color }} />{body.category}</span></div>
      <h2>{body.name}<span>.</span></h2>
      <p className="planet-tagline">{body.tagline}</p>
      <p className="description">{body.description}</p>
      <div className="temperature"><span>Température de référence</span><strong>{body.temperature}</strong><p>{body.temperatureNote}</p></div>
      <dl className="science-stats">{stats.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
        <div><dt>Satellites naturels</dt><dd>{body.id === 'sun' ? 'Sans objet' : body.satellites ?? <a href={body.source} target="_blank" rel="noreferrer">Inventaire NASA <ArrowUpRight size={12} /></a>}</dd></div>
      </dl>
      {body.satellitesNote && <p className="satellites-note">{body.satellitesNote}</p>}
      <div className="facts-title"><ArrowDownRight size={16} /><span>À RETENIR</span></div>
      <ul className="facts">{body.facts.map(fact => <li key={fact}>{fact}</li>)}</ul>
      <div className="sources"><span>POUR ALLER PLUS LOIN</span><div><a href={body.source} target="_blank" rel="noreferrer">NASA <ArrowUpRight size={12} /></a><a href={FACT_SHEET} target="_blank" rel="noreferrer">Données chiffrées <ArrowUpRight size={12} /></a><a href={body.wiki} target="_blank" rel="noreferrer">Wikipédia <ArrowUpRight size={12} /></a></div><p>Références consultées le {DATA_REVIEW_DATE}. Valeurs arrondies. Les inventaires de lunes évoluent.</p></div>
    </div>
    <div className="panel-bottom"><button onClick={onPrevious} aria-label="Astre précédent"><ChevronLeft size={16} />Précédent</button><span>{String(index + 1).padStart(2, '0')} — 09</span><button onClick={onNext} aria-label="Astre suivant">Suivant<ChevronRight size={16} /></button></div>
  </aside>
}
