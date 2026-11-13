import { AdditiveBlending, BackSide, Color, Vector3 } from 'three'
import { useMemo } from 'react'

const vertexShader = `
  varying vec3 vNormal;
  varying vec3 vWorld;
  void main() {
    vNormal = normalize(mat3(modelMatrix) * normal);
    vWorld = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * viewMatrix * vec4(vWorld, 1.0);
  }
`
const fragmentShader = `
  uniform vec3 glowColor;
  uniform vec3 sunPosition;
  varying vec3 vNormal;
  varying vec3 vWorld;
  void main() {
    vec3 viewDirection = normalize(cameraPosition - vWorld);
    float edge = pow(1.0 - abs(dot(normalize(vNormal), viewDirection)), 3.0);
    float daylight = max(0.12, dot(normalize(vNormal), normalize(sunPosition - vWorld)));
    gl_FragColor = vec4(glowColor, edge * daylight * 0.6);
  }
`
export default function Atmosphere({ radius, color }: { radius: number; color: string }) {
  const uniforms = useMemo(() => ({ glowColor: { value: new Color(color) }, sunPosition: { value: new Vector3() } }), [color])
  return <mesh scale={radius * 1.045}>
    <sphereGeometry args={[1, 48, 32]} />
    <shaderMaterial uniforms={uniforms} vertexShader={vertexShader} fragmentShader={fragmentShader} side={BackSide} transparent depthWrite={false} blending={AdditiveBlending} />
  </mesh>
}
