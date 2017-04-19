import { connect } from 'react-redux'
import { fakePerson, SAMPLE_IMAGE_URL } from 'components/PostCard/samplePost'
import faker from 'faker'
import { goBack } from 'react-router-redux'
import { getMe } from 'store/selectors/getMe'
import { fetchUserSettings } from './Settings.store'

faker.seed(993)

const SAMPLE_USER = {
  ...fakePerson(),
  bio: 'Subtly charming problem solver. Friendly travel guru. Avid entrepreneur. Activist. Creator.',
  location: 'Vancouver, BC',
  url: 'www.soniajohnson.com',
  email: 'sonia@soniajohnson.com',
  facebookUrl: 'facebook.com/soniaj',
  twitterUrl: 'twitter.com/soniaj',
  avatarUrl: faker.image.avatar(),
  bannerUrl: SAMPLE_IMAGE_URL
}

export function mapStateToProps (state, props) {
  return {
    currentUser: getMe(state, props)
  }
}

export const mapDispatchToProps = {
  goBack,
  fetchUserSettings
}

export default connect(mapStateToProps, mapDispatchToProps)
