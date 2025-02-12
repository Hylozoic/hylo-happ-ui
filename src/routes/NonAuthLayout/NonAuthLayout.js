import React from 'react'
import { Route, Link } from 'react-router-dom'
import Particles from 'react-particles-js'
import particlesjsConfig from './particlesjsConfig'
import Button from 'components/Button'
import Signup from './Signup'
import RegisterAgent from './RegisterAgent'
import PasswordReset from 'routes/NonAuthLayout/PasswordReset'
import './NonAuthLayout.scss'

export default class NonAuthLayout extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    const particlesStyle = {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%'
    }
    return <div styleName='background'>
      <div styleName='particlesBackgroundWrapper'>
        <Particles params={particlesjsConfig} style={particlesStyle} />
      </div>
      <div styleName='topRow'>
        <a href='/'>
          <img styleName='logo' src='assets/hylo.svg' alt='Hylo logo' />
        </a>
        <Route path='/reset-password' component={() =>
          <Link to='/register'>
            <Button styleName='signupButton' color='green-white-green-border'>Log In</Button>
          </Link>
        } />
      </div>

      <Route path='/register' component={() =>
        <RegisterAgent {...this.props} styleName='form' />
      } />

      <Route path='/signup' component={() =>
        <Signup {...this.props} styleName='form' />
      } />

      <Route path='/reset-password' component={() =>
        <PasswordReset {...this.props} styleName='form' />
      } />

      <div>
        <p styleName='below-container'>
          <Route path='/signup' component={() =>
            <Link to='/register'>
              Already have an account? <span styleName='green-text'>Sign in</span>
            </Link>
          } />
        </p>
      </div>
    </div>
  }
}
