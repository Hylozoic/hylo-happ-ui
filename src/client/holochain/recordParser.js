import { get, isArray } from 'lodash/fp'
import { decode } from '@msgpack/msgpack'

// TIMESTAMP
// record.signed_action.hashed.content.timestamp (FORMAT: 1658438688413920)
// AUTHOR (AGENT_PUB_KEY)
// record.signed_action.hashed.content.author

export function decodedEntryFromRecord (record) {
  // console.log('!!!! zome response (record - raw):', record)
  // console.log('!!!! zome response (entry - decoded):', entry)
  // signed_action.hashed.hash.toString()

  const entry = decode(get('entry.Present.entry', record))

  entry.author_pub_key = record.signed_action.hashed.content.author
  // entry.timestamp = new Date()
  // record.signed_action.hashed.content.timestamp

  if (entry.agent_pub_key) {
    entry.agent_pub_key = entry.agent_pub_key.toString()
  }

  if (get('signed_action.hashed.hash', record)) {
    entry.action_hash = record.signed_action.hashed.hash.toString()
  }

  return entry
}

export default function recordParser (response) {
  // Handle array responses differently
  if (isArray(response)) {
    return response.map(decodedEntryFromRecord)
  } else {
    return decodedEntryFromRecord(response)
  }
}

// To ALSO return entry_type:
// const entryType = get('entry.Present.entry_type', response)
// return {
//   entry_type: entryType,
//   entry
// }

// // Serialize Byte Array agentPubKey to String
// entry.agent_pub_key = entry.agent_pub_key.toString()
// const uint8array = new TextEncoder().encode(string)
