const store = new Map()

const isStringified = str => {
  try {
    JSON.parse(str)
    return true
  } catch (e) {
    return false
  }
}

const getItem = (key, cb) => {
  const value = store.get(key) || null
  if (cb) cb(null, value)

  return value
}

const setItem = (key, value, cb) => {
  store.set(key, value)
  if (cb) cb(null)
}

const removeItem = (key, cb) => {
  store.delete(key)
  if (cb) cb(null)
}
const mergeItem = (key, value, cb) => {
  const prevValue = getItem(key)

  if (!prevValue) throw new Error(`No item with ${key} key`)
  if (!isStringified(prevValue)) throw new Error(`Invalid item with ${key} key`)
  if (!isStringified(value))
    throw new Error(`Invalid value to merge with ${key}`)

  const merged = { ...JSON.parse(prevValue), ...JSON.parse(value) }

  setItem(key, JSON.stringify(merged))

  if (cb) cb(null)
}

const clear = cb => {
  store.clear()
  if (cb) cb(null)
}

const getAllKeys = cb => {
  const keys = Array.from(store.keys())
  if (cb) cb(null, keys)

  return keys
}

const flushGetRequests = () => {}

const multiGet = (entries, cb) => {
  const values = entries.map(entry => [entry, getItem(entry)])
  if (cb) cb(null, values)

  return values
}

const multiSet = (entries, cb) => {
  entries.forEach(entry => setItem(entry[0], entry[1]))
  if (cb) cb(null)
}

const multiRemove = (keys, cb) => {
  keys.forEach(key => removeItem(key))
  if (cb) cb(null)
}
const multiMerge = (entries, cb) => {
  const errors = []

  for (const [key, value] of entries) {
    try {
      if (value) {
        mergeItem(key, value)
      }
    } catch (err) {
      errors.push(err)
    }
  }

  if (errors.length) {
    if (cb) cb(errors)
    return errors
  }

  if (cb) cb(null)
}

module.exports = {
  store,
  getItem,
  setItem,
  removeItem,
  mergeItem,
  clear,
  getAllKeys,
  flushGetRequests,
  multiGet,
  multiSet,
  multiRemove,
  multiMerge
}
