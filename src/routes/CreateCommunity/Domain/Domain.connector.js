import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { addCommunityDomain, fetchCommunity } from './Domain.store'

export function mapStateToProps (state, props) {
  return {
    communityName: state.CreateCommunity.name
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    goToNextStep: () => dispatch(push('/create-community/privacy')),
    goToPreviousStep: () => dispatch(push('/create-community/name')),
    addCommunityDomain: (domain) => dispatch(addCommunityDomain(domain)),
    fetchCommunity: (slug) => dispatch(fetchCommunity(slug))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
