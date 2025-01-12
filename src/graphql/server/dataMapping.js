import { invert, isArray } from 'lodash/fp'

// Data mapping, interface <> Hylo UI
export const interfaceDefaultAttribsMap = () => ({
  post: {
    announcement: false
  },
  comment: {
    attachments: []
  }
})

const uiDefaultAttribsMap = () => ({
})

export const toInterfaceKeyMap = {
  global: {
    'avatarUrl': 'avatar_url',
    'createdAt': 'timestamp',
    'creator': 'author_pub_key',
    'id': 'action_hash',
    'lastReadTime': 'last_read_time',
    'messageThreadId': 'thread_action_hash',
    'participantIds': 'participant_action_hashes'
  },
  post: {
    'postToGroupIds': 'base_action_hashes',
    'type': 'post_type'
  },
  person: {
    'id': 'agent_pub_key'
  },
  community: {
  },
  comment: {
    'postId': 'base_action_hash',
    'text': 'details'
  }
}

export const toUiKeyMap = {}

for (let key in toInterfaceKeyMap) {
  toUiKeyMap[key] = invert(toInterfaceKeyMap[key])
}

export const createDataRemapper = initialDataMap => (type, data) => {
  const clonedData = Object.assign({}, data)
  const dataMapForType = type in initialDataMap
    ? initialDataMap[type]
    : {}
  const dataMap = Object.assign({}, dataMapForType, initialDataMap['global'])
  let remappedData = {}

  for (let key in data) {
    const mappedKey = key in dataMap
      ? dataMap[key]
      : key
    remappedData[mappedKey] = data[key]
    // TODO: Mutating passed object. Used a cloned copy or do another way
    delete clonedData[key]
  }

  return {
    ...clonedData,
    ...remappedData
  }
}

export const toInterfaceData = (...args) => {
  if (typeof args[1] !== 'object' || isArray(args[1])) return args[1]

  const results = createDataRemapper(toInterfaceKeyMap)(...args)

  return {
    ...interfaceDefaultAttribsMap()[args[0]],
    ...results
  }
}

export const toUiData = (...args) => {
  const results = createDataRemapper(toUiKeyMap)(...args)

  return {
    ...uiDefaultAttribsMap()[args[0]],
    ...results
  }
}

export const toUiQuerySet = (entityType, items, { hasMore = false } = {}) => ({
  total: items.length,
  items: items.map(item => toUiData(entityType, item)),
  hasMore
})

export async function dataMappedCall (entityType, inputData, interfaceFunc) {
  const interfaceData = toInterfaceData(entityType, inputData)
  const interfaceResult = await interfaceFunc(interfaceData)

  return toUiData(entityType, interfaceResult)
}
