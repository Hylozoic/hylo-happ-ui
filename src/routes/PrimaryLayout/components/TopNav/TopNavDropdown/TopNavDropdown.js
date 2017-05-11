import React, { PropTypes, Component } from 'react'
import './TopNavDropdown.scss'
const { object, string } = PropTypes
import cx from 'classnames'
import { position } from 'util/scrolling'

const DROPDOWN_WIDTH = 375

export default class TopNavDropdown extends Component {
  static propTypes = {
    toggleChildren: object,
    className: string,
    header: object,
    items: object
  }

  constructor (props) {
    super(props)
    this.state = {active: true}
  }

  toggle = () => {
    this.setState({active: !this.state.active})
  }

  render () {
    const { toggleChildren, className, topNavPosition, header, body } = this.props
    const { active } = this.state

    const wrapperStyle = {
      top: `${topNavPosition.height + 24}px`,
      left: `${topNavPosition.rightX - (DROPDOWN_WIDTH + 15)}px`
    }

    const toggleX = position(this.refs.toggle).x

    const triangleStyle = {
      left: `${toggleX - 880}px`
    }

    return <div className={className} styleName='top-nav-dropdown'>
      <a onClick={this.toggle} ref='toggle'>
        {toggleChildren}
      </a>
      <div styleName={cx('wrapper', {active})} style={wrapperStyle}>
        <ul styleName='menu'>
          <li styleName='triangle' style={triangleStyle} />
          <li styleName='header'>
            {header}
          </li>
          {body}
        </ul>
      </div>
    </div>
  }
}
