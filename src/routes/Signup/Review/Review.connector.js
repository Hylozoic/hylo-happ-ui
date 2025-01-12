import { connect } from 'react-redux'
import { push, goBack } from 'connected-react-router'
import getMe from 'store/selectors/getMe'
import updateUserSettings from 'store/actions/updateUserSettings'
import trackAnalyticsEvent from 'store/actions/trackAnalyticsEvent'
import fetchMySkills from 'store/actions/fetchMySkills'
import getMySkills from 'store/selectors/getMySkills'
import { getReturnToURL, resetReturnToURL } from 'router/AuthRoute/AuthRoute.store'

export function mapStateToProps (state, props) {
  return {
    currentUser: getMe(state),
    skills: getMySkills(state),
    returnToURL: getReturnToURL(state)
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    updateUserSettings: (changes) => dispatch(updateUserSettings(changes)),
    trackAnalyticsEvent: (name, data) => dispatch(trackAnalyticsEvent(name, data)),
    goToPreviousStep: () => dispatch(push('/signup/add-skills')),
    goBack: () => dispatch(goBack()),
    push: (path) => dispatch(push(path)),
    fetchMySkills: () => dispatch(fetchMySkills()),
    resetReturnToURL: () => dispatch(resetReturnToURL())
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    goToNextStep: (defaultPath = '/all') => {
      dispatchProps.resetReturnToURL()
      dispatchProps.push(stateProps.returnToURL || defaultPath)
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
