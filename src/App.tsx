import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowRight, ArrowUpRight, CircleHelp, Expand, Maximize2, Mouse, MoveUpRight, Orbit, Pause, Play, RotateCcw, Settings2, Sparkles } from 'lucide-react'
import gsap from 'gsap'
import { bodies, bodyById, type BodyId } from './data/bodies'
import { neighbor } from './lib/simulation'
import { readPreference, savePreference, useQuality, useReducedMotion } from './hooks/usePreferences'
import InfoPanel from './components/InfoPanel'
import PlanetNavigation from './components/PlanetNavigation'
import Settings from './components/Settings'
import SceneBoundary from './components/SceneBoundary'

const SolarScene = lazy(() => import('./scene/SolarScene'))
function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2')
    if (!gl) return false
    gl.getExtension('WEBGL_lose_context')?.loseContext()
    return true
  } catch { return false }
}

export default function App() {
  const reducedMotion = useReducedMotion()
  const { quality, setQuality, resolved } = useQuality()
  const [skipIntro, setSkipIntro] = useState(() => readPreference('skip-intro', 'false') === 'true')
  const [intro, setIntro] = useState(() => !reducedMotion && !skipIntro)
  const [selected, setSelected] = useState<BodyId | null>(null)
  const [paused, setPaused] = useState(reducedMotion)
  const [speed, setSpeed] = useState(12)
  const [labels, setLabels] = useState(() => readPreference('labels', 'true') !== 'false')
  const [settings, setSettings] = useState(false)
  const [help, setHelp] = useState(false)
  const [ready, setReady] = useState(false)
  const [progress, setProgress] = useState(0)
  const [webgl, setWebgl] = useState(supportsWebGL)
  const [textureError, setTextureError] = useState(false)
  const [notice, setNotice] = useState('')
  const hero = useRef<HTMLElement>(null)
  const select = useCallback((id: BodyId) => { setSelected(id); setIntro(false) }, [])
  const overview = useCallback(() => { setSelected(null); setIntro(false) }, [])
  const onReady = useCallback(() => setReady(true), [])
  const onTextureError = useCallback(() => setTextureError(true), [])
  const onFailure = useCallback(() => { setWebgl(false); setReady(true) }, [])
  const previous = useCallback(() => select(neighbor(selected, -1)), [select, selected])
  const next = useCallback(() => select(neighbor(selected, 1)), [select, selected])

  useEffect(() => { savePreference('skip-intro', String(skipIntro)) }, [skipIntro])
  useEffect(() => { savePreference('labels', String(labels)) }, [labels])
  useEffect(() => { if (reducedMotion) { setIntro(false); setPaused(true) } }, [reducedMotion])
  useEffect(() => {
    if (!intro || !hero.current) return
    const context = gsap.context(() => gsap.fromTo('[data-reveal]', { y: reducedMotion ? 0 : 20, opacity: 0 }, { y: 0, opacity: 1, stagger: .1, duration: .9, ease: 'power3.out' }), hero)
    return () => context.revert()
  }, [intro, reducedMotion])
  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement
      if (settings || event.altKey || event.ctrlKey || event.metaKey || target.closest('input, select, textarea')) return
      if (event.key === 'Escape') { setHelp(false); overview() }
      if (event.key === 'ArrowRight') { event.preventDefault(); next() }
      if (event.key === 'ArrowLeft') { event.preventDefault(); previous() }
      if (event.code === 'Space' && !target.closest('button, a')) { event.preventDefault(); setPaused(value => !value) }
    }
    window.addEventListener('keydown', keydown)
    return () => window.removeEventListener('keydown', keydown)
  }, [next, overview, previous, settings])
  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(() => setNotice(''), 4500)
    return () => clearTimeout(timer)
  }, [notice])

  async function fullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
      else if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen()
      else setNotice('Le plein écran n’est pas disponible dans ce navigateur.')
    } catch { setNotice('Le navigateur ne permet pas le plein écran dans cette fenêtre.') }
  }

  return <main className={`observatory ${intro ? 'is-intro' : 'is-exploring'} ${selected ? 'has-selection' : ''}`}>
    <a className="skip-link" href="#planet-navigation">Aller à la navigation des astres</a>
    <div className="scene-container" aria-hidden={intro && webgl ? 'true' : undefined}>
      {webgl ? <SceneBoundary onError={onFailure}><Suspense fallback={null}><SolarScene selected={selected} intro={intro} paused={paused} speed={speed} quality={resolved} reducedMotion={reducedMotion} labels={labels} onSelect={select} onReady={onReady} onTextureError={onTextureError} onFailure={onFailure} onLoading={setProgress} /></Suspense></SceneBoundary>
        : <div className="fallback-scene"><div className="fallback-planet" style={{ '--planet-color': bodyById[selected ?? 'earth'].color } as React.CSSProperties} /><p role="status">Le rendu 3D est indisponible sur cet appareil.<br />Explorez les neuf fiches avec la navigation ci-dessous.</p></div>}
    </div>
    <div className="scene-vignette" />

    <header className="site-header">
      <button className="brand" aria-label="Planets2See, accueil" onClick={() => { setSelected(null); setIntro(!reducedMotion && !skipIntro) }}><span className="brand-icon"><Orbit size={30} strokeWidth={1.3} /></span><span>planets<span className="brand-two">2</span>see<small>UN AUTRE REGARD SUR L’UNIVERS</small></span></button>
      <div className="header-location"><span className="live-dot" />SYSTÈME SOLAIRE<span className="location-divider">/</span><span>VOIE LACTÉE</span></div>
      <div className="header-actions"><button className="icon-button help-button" aria-label="Afficher les commandes" aria-expanded={help} onClick={() => setHelp(!help)}><CircleHelp size={18} /></button><button className="icon-button" aria-label="Plein écran" title="Plein écran" onClick={fullscreen}><Maximize2 size={18} /></button><button className={`icon-button ${settings ? 'active' : ''}`} aria-label="Réglages" onClick={() => setSettings(true)}><Settings2 size={19} /></button></div>
    </header>

    {intro ? <section className="hero" ref={hero} aria-labelledby="hero-title">
      <div className="hero-eyebrow" data-reveal><span />BIENVENUE DANS VOTRE OBSERVATOIRE</div>
      <h1 id="hero-title" data-reveal>Le cosmos,<br />à portée de <em>regard.</em></h1>
      <p className="hero-description" data-reveal>Il y a des mondes qui attendent d’être découverts.<br className="desktop-break" /> Prenez le temps de vous perdre dans l’immensité.</p>
      <div className="hero-actions" data-reveal><button className="primary-button" onClick={overview}>Commencer l’exploration<ArrowUpRight size={19} /></button><button className="text-button" onClick={() => select('earth')}>Découvrir la Terre<ArrowRight size={16} /></button></div>
      <div className="hero-meta" data-reveal><span><i />9 ASTRES À EXPLORER</span><span>UNE INFINITÉ DE PERSPECTIVES</span></div>
    </section> : <section className="explore-heading" aria-live="polite"><div className="eyebrow"><span className="live-dot" />{selected ? 'EXPLORATION RAPPROCHÉE' : 'VOTRE FENÊTRE SUR L’UNIVERS'}</div><h1>{selected ? bodyById[selected].name : 'Le système solaire'}<span>.</span></h1><p>{selected ? 'Un monde à découvrir. Changez de perspective.' : 'Neuf astres. Une étoile. Votre voyage.'}</p>{selected && <button className="back-button" onClick={overview}><RotateCcw size={13} />Vue d’ensemble</button>}</section>}

    {intro && <div className="earth-caption"><span className="caption-line" /><div><span>03 / NOTRE MONDE</span><strong>La Terre<MoveUpRight size={14} /></strong><small>149,6 millions de km du Soleil</small></div></div>}
    {!intro && !selected && <div className="overview-note"><Sparkles size={16} /><span>Sélectionnez un astre.<br /><strong>Laissez votre curiosité vous guider.</strong></span></div>}

    {!intro && selected && <InfoPanel body={bodyById[selected]} reducedMotion={reducedMotion} onClose={overview} onPrevious={previous} onNext={next} />}

    {help && <div className="help-popover" role="region" aria-label="Commandes d’exploration"><strong>Votre cockpit, en quelques gestes.</strong><p><Mouse size={15} />Glisser pour orbiter · Molette pour zoomer</p><p><Expand size={15} />Sur mobile : un doigt pour tourner, deux pour zoomer</p><p><span className="keycap">← →</span>Astre précédent / suivant</p><p><span className="keycap">espace</span>Pause / lecture</p><p><span className="keycap">échap</span>Vue d’ensemble</p></div>}

    <div className="bottom-interface" id="planet-navigation">
      <div className="above-nav"><span className="navigation-title">{intro ? 'CHOISISSEZ VOTRE DESTINATION' : 'LE VOYAGE CONTINUE'}<ArrowDown size={12} /></span>
        <div className="playback"><button className="icon-button" aria-label={paused ? 'Reprendre la simulation' : 'Mettre en pause'} aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? <Play size={13} fill="currentColor" /> : <Pause size={13} fill="currentColor" />}</button><span className="playback-label">TEMPS</span><select aria-label="Vitesse de la simulation" value={speed} onChange={e => setSpeed(Number(e.target.value))}><option value={1}>1 j/s</option><option value={12}>12 j/s</option><option value={60}>60 j/s</option><option value={240}>240 j/s</option></select></div>
      </div>
      <PlanetNavigation selected={selected} intro={intro} onSelect={select} onOverview={overview} />
      <footer className="site-footer"><span><span className="live-dot" />{!webgl ? 'MODE DOCUMENTAIRE' : !ready || progress < 100 ? `CHARGEMENT ${Math.round(progress)} %` : 'L’EXPLORATION EST À VOUS'}</span><span>Représentation artistique · Proportions adaptées</span><a href="https://www.solarsystemscope.com/textures/" target="_blank" rel="noreferrer" title="Textures Solar System Scope, sous licence CC BY 4.0">Textures : SSS · CC BY 4.0<ArrowUpRight size={10} /></a></footer>
    </div>

    <div className="sr-only" role="status" aria-live="polite">{!intro && selected ? `Vous explorez ${bodyById[selected].name}. Sa fiche est disponible.` : !intro ? 'Vue d’ensemble du système solaire.' : ''}</div>
    {textureError && <div className="texture-notice" role="status">Certaines textures n’ont pas pu être chargées. Les astres et les fiches restent accessibles.</div>}
    {notice && <div className="toast" role="status">{notice}</div>}
    {settings && <Settings quality={quality} resolved={resolved} setQuality={setQuality} labels={labels} setLabels={setLabels} skipIntro={skipIntro} setSkipIntro={setSkipIntro} reducedMotion={reducedMotion} onClose={() => setSettings(false)} />}
    <span className="sr-only">{bodies.length} astres disponibles. Les vitesses et les positions sont illustratives.</span>
  </main>
}
