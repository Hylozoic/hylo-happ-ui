import { connect } from 'react-redux'
import {
  getMemberVotes,
  fetchMemberVotes
} from './MemberVotes.store'

export function mapStateToProps (state, props) {
  return {
    posts: getMemberVotes(state, props)
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    fetchMemberVotes: personId => dispatch(fetchMemberVotes(personId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
