import { Component } from 'react'

// Fanger fejl i et spil/en side, så resten af appen ikke går ned.
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <main className="page-shell">
          <section className="about-panel">
            <h1>Der skete en fejl</h1>
            <p>{this.state.error.message}</p>
          </section>
        </main>
      )
    }

    return this.props.children
  }
}
