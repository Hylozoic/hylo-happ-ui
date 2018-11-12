import { shallow } from 'enzyme'
import React from 'react'

import MemberVotes from './MemberVotes'
import denormalized from '../MemberProfile.test.json'

describe.only('MemberVotes', () => {
  const { person } = denormalized.data

  it('renders the same as the last snapshot', () => {
    const wrapper = shallow(
      <MemberVotes fetchMemberVotes={jest.fn()} voteOnPost={jest.fn()} posts={person.votes} />
    )
    expect(wrapper).toMatchSnapshot()
  })
})
