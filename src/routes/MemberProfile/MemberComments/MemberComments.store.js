import { createSelector } from 'reselect'
import { compact } from 'lodash/fp'
import getPerson from 'store/selectors/getPerson'
import { presentComment } from 'routes/MemberProfile/RecentActivity/RecentActivity.store'

export const FETCH_MEMBER_COMMENTS = 'FETCH_MEMBER_COMMENTS'

const memberCommentsQuery =
`query MemberComments ($id: ID, $order: String, $limit: Int) {
  person (id: $id) {
    id
    comments (first: $limit, order: $order) {
      items {
        id
        text
        creator {
          id
        }
        post {
          id
          title
        }
        attachments {
          id
          url
          type
        }
        createdAt
      }
    }
  }
}`

export function fetchMemberComments (id, order = 'desc', limit = 20, query = memberCommentsQuery) {
  return {
    type: FETCH_MEMBER_COMMENTS,
    graphql: {
      query,
      variables: { id, limit, order }
    },
    meta: {extractModel: 'Person'}
  }
}

export const getMemberComments = createSelector(
  getPerson,
  (state, { slug }) => slug,
  (person, slug) =>
    person && compact(person.comments.toModelArray().map(comment => presentComment(comment, slug)))
      .sort(c => c.createdAt)
)
