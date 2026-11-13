import { Component, type ErrorInfo, type ReactNode } from 'react'

export default class SceneBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error('Le rendu 3D a été interrompu.', error, info); this.props.onError() }
  render() { return this.state.failed ? null : this.props.children }
}
