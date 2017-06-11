/* eslint flowtype-errors/show-errors: 0 */
import React from 'react'
import { Switch, Route } from 'react-router'
import HomePage from './pages/HomePage'
import CurrencyPage from './pages/CurrencyPage'
import SiteTemplate from './templates/SiteTemplate'

export default () => (
  <SiteTemplate>
    <Switch>
      <Route exact path='/' component={HomePage} />
      <Route path='/currency/:name' component={CurrencyPage} />
    </Switch>
  </SiteTemplate>
)
