/* eslint flowtype-errors/show-errors: 0 */
import React from 'react'
import { Switch, Route } from 'react-router'
import App from './pages/App'
import HomePage from './pages/HomePage'
import CurrencyPage from './pages/CurrencyPage'
import SiteTemplate from './templates/SiteTemplate'

export default () => (
  <App>
    <Switch>
      <SiteTemplate>
        <Route path='/currency/:name' component={CurrencyPage} />
        <Route path='/' component={HomePage} />
      </SiteTemplate>
    </Switch>
  </App>
)
