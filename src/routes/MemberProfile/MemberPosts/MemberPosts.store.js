import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'
import { presentPost } from 'store/selectors/getPost'
import { FETCH_MEMBER_POSTS } from '../MemberProfile.store'
import { postsQueryFragment } from 'components/FeedList/FeedList.store'

const memberPostsQuery =
`query MemberPosts (
  $id: ID,
  $sortBy: String,
  $offset: Int,
  $search: String,
  $filter: String,
  $first: Int,
  $topic: ID
) {
  person (id: $id) {
    id
    ${postsQueryFragment}
  }
}`

export function fetchMemberPosts (id, first = 20, query = memberPostsQuery) {
  return {
    type: FETCH_MEMBER_POSTS,
    graphql: {
      query,
      variables: {id, first}
    },
    meta: {extractModel: 'Person'}
  }
}

export const getMemberPosts = ormCreateSelector(
  orm,
  state => state.orm,
  (_, { personId }) => personId,
  ({ Person }, personId) => {
    if (!Person.hasId(personId)) return
    return Person.withId(personId).posts.toModelArray().map(post =>
      presentPost(post))
  }
)
