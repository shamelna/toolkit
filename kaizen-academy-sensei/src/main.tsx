import React from 'react'
import ReactDOM from 'react-dom/client'
import KaizenSensei from './components/KaizenSenseiStyled'
import KaizenHeader from './components/KaizenHeader'
import KaizenFooter from './components/KaizenFooter'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <KaizenHeader />
    <KaizenSensei />
    <KaizenFooter />
  </React.StrictMode>,
)
