import { useEffect, useState } from 'react'
import { SRGBColorSpace, TextureLoader, type Texture } from 'three'

export function useTextureAsset(url: string, onError: () => void, color = true) {
  const [texture, setTexture] = useState<Texture | null>(null)
  useEffect(() => {
    let active = true
    new TextureLoader().load(url, loaded => {
      if (!active) { loaded.dispose(); return }
      if (color) loaded.colorSpace = SRGBColorSpace
      loaded.anisotropy = 4
      setTexture(loaded)
    }, undefined, () => { if (active) onError() })
    return () => { active = false }
  }, [url, color, onError])
  useEffect(() => () => { texture?.dispose() }, [texture])
  return texture
}
