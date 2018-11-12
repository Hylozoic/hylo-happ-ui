import React from 'react'
import PropTypes from 'prop-types'
import { POST_PROP_TYPES } from 'store/models/Post'
import { CURRENT_USER_PROP_TYPES } from 'store/models/Me'
import { PERSON_PROP_TYPES } from 'store/models/Person'
import { find, get, sortBy, isFunction } from 'lodash/fp'
import './PostFooter.scss'
import Icon from 'components/Icon'
import RoundImageRow from 'components/RoundImageRow'
import cx from 'classnames'
import ReactTooltip from 'react-tooltip'

export default class PostFooter extends React.PureComponent {
  static propTypes= {
    postId: POST_PROP_TYPES.id,
    type: PropTypes.string,
    currentUser: PropTypes.shape(CURRENT_USER_PROP_TYPES),
    commenters: PropTypes.array,
    commentersTotal: PropTypes.number,
    votesTotal: PropTypes.number,
    myVote: PropTypes.bool,
    members: PropTypes.arrayOf(PropTypes.shape(PERSON_PROP_TYPES)),
    voteOnPost: PropTypes.func.isRequired,
    onClick: PropTypes.func
  }

  render () {
    const {
      postId,
      currentUser,
      commenters,
      commentersTotal,
      votesTotal,
      myVote,
      members,
      type
    } = this.props
    const onClick = isFunction(this.props.onClick) ? this.props.onClick : undefined
    const vote = isFunction(this.props.voteOnPost) ? () => this.props.voteOnPost(postId, !myVote) : undefined
    const isProject = type === 'project'
    let avatarUrls, caption

    if (isProject) {
      avatarUrls = members.map(p => p.avatarUrl)
      caption = peopleCaption(
        members,
        members.length,
        get('id', currentUser),
        {
          emptyMessage: 'No project members',
          phraseSingular: 'is a member',
          mePhraseSingular: 'are a member',
          pluralPhrase: 'are members'
        }
      )
    } else {
      avatarUrls = commenters.map(p => p.avatarUrl)
      caption = peopleCaption(
        commenters,
        commentersTotal,
        get('id', currentUser),
        {
          emptyMessage: 'Be the first to comment',
          phraseSingular: 'commented',
          mePhraseSingular: 'commented',
          pluralPhrase: 'commented'
        }
      )
    }

    return <div styleName='footer'>
      <RoundImageRow imageUrls={avatarUrls.slice(0, 3)} styleName='people' onClick={onClick} />
      <span styleName='caption' onClick={onClick} style={{cursor: onClick ? 'pointer' : 'inherit'}}>
        {caption}
      </span>
      <a onClick={vote} styleName={cx('vote-button', {voted: myVote})}
        data-tip-disable={myVote} data-tip='Upvote this post so more people see it.' data-for='postfooter-tt'>
        <Icon name='ArrowUp' styleName='arrowIcon' />
        {votesTotal}
      </a>
      <ReactTooltip
        effect={'solid'}
        delayShow={550}
        id='postfooter-tt' />
    </div>
  }
}

export const peopleCaption = (
  people,
  peopleTotal,
  meId,
  phrases = {
    emptyMessage: 'Be the first to comment',
    phraseSingular: 'commented',
    mePhraseSingular: 'commented',
    pluralPhrase: 'commented'
  }
) => {
  const currentUserIsMember = find(c => c.id === meId, people)
  const sortedPeople = currentUserIsMember && people.length === 2
    ? sortBy(c => c.id !== meId, people) // me first
    : sortBy(c => c.id === meId, people) // me last
  const firstName = person => person.id === meId ? 'You' : person.name.split(' ')[0]
  const {
    emptyMessage,
    phraseSingular,
    mePhraseSingular,
    pluralPhrase
  } = phrases
  let names = ''
  let phrase = pluralPhrase

  if (sortedPeople.length === 0) return emptyMessage

  if (sortedPeople.length === 1) {
    phrase = currentUserIsMember ? mePhraseSingular : phraseSingular
    names = firstName(sortedPeople[0])
  } else if (sortedPeople.length === 2) {
    names = `${firstName(sortedPeople[0])} and ${firstName(sortedPeople[1])}`
  } else {
    names = `${firstName(sortedPeople[0])}, ${firstName(sortedPeople[1])} and ${peopleTotal - 2} other${peopleTotal - 2 > 1 ? 's' : ''}`
  }
  return `${names} ${phrase}`
}
