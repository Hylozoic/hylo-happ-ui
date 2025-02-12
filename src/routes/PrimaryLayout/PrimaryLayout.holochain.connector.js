import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'connected-react-router'
import { graphql } from 'react-apollo'
import { get, compose } from 'lodash/fp'
import { communityUrl } from 'util/navigation'
import HolochainCommunityQuery from 'graphql/queries/HolochainCommunityQuery.graphql'
import HolochainCurrentUserQuery from 'graphql/queries/HolochainCurrentUserQuery.graphql'
import fetchForCurrentUserMock from 'store/actions/fetchForCurrentUserMock'
import isCommunityRoute, { getSlugFromLocation } from 'store/selectors/isCommunityRoute'
import getMe from 'store/selectors/getMe'
import { getReturnToURL } from 'router/AuthRoute/AuthRoute.store'
import { toggleDrawer } from './PrimaryLayout.store'

export function mapStateToProps (state, props) {
  const slug = getSlugFromLocation(null, props)

  return {
    currentUser: getMe(state),
    slug,
    returnToURL: getReturnToURL(state),
    isCommunityRoute: isCommunityRoute(state, props),
    isDrawerOpen: get('PrimaryLayout.isDrawerOpen', state),
    showLogoBadge: false,
    // not used by holochain
    fetchForCommunity: () => {}
  }
}

export function mapDispatchToProps (dispatch, props) {
  const slug = getSlugFromLocation(null, props)

  return bindActionCreators({
    fetchForCurrentUserMock,
    toggleDrawer,
    goBack: () => push(communityUrl(slug))
  }, dispatch)
}

const community = graphql(HolochainCommunityQuery, {
  skip: props => !props.currentUser || !props.slug,
  props: ({ data: { community, loading } }) => ({
    community: community || {},
    communityPending: loading
  }),
  options: props => ({
    variables: {
      slug: props.slug,
      withPosts: false
    }
  })
})

const currentUserFromHolochainAgent = graphql(HolochainCurrentUserQuery, {
  skip: props => props.currentUser,
  props: ({ data: { me: holochainAgent, loading } }) => {
    if (loading) return

    return {
      holochainAgent,
      loading
    }
  }
})

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  currentUserFromHolochainAgent,
  community
)
