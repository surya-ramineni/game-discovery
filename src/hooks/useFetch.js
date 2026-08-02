import { useCallback, useEffect, useState } from 'react'

/**
 * Generic data-fetching hook.
 *
 * `params` is almost always written as an object literal at the call site:
 *
 *   useFetch(getGames, { page, search })
 *
 * That object is a brand new reference on every render. Putting it straight
 * into the dependency array means the effect re-runs every render -> setState
 * -> render -> effect... an infinite request loop. Serializing it to a string
 * makes the dependency a primitive, so the effect only re-runs when the actual
 * values change. Callers don't have to remember to useMemo.
 */
export default function useFetch(fetcher, params = {}) {
  const [attempt, setAttempt] = useState(0)
  const paramsKey = JSON.stringify(params)
  // `attempt` is part of the identity so a manual reload counts as a new
  // request and flips `loading` back on.
  const key = `${paramsKey}|${attempt}`

  // One state object, written only from async callbacks. `settledKey` records
  // which request it belongs to, which lets `loading` be derived during render
  // rather than set synchronously in the effect (cascading renders).
  const [state, setState] = useState({
    settledKey: null,
    data: null,
    error: null,
  })

  const reload = useCallback(() => setAttempt((n) => n + 1), [])

  useEffect(() => {
    let cancelled = false

    fetcher(JSON.parse(paramsKey))
      .then((result) => {
        if (!cancelled) setState({ settledKey: key, data: result, error: null })
      })
      .catch((err) => {
        if (!cancelled) setState({ settledKey: key, data: null, error: err })
      })

    // Ignoring a stale response matters here: type "hal" fast enough and the
    // response for "ha" can land after the one for "hal".
    return () => {
      cancelled = true
    }
  }, [fetcher, paramsKey, key])

  return {
    data: state.data,
    error: state.error,
    loading: state.settledKey !== key,
    reload,
  }
}
