/** Reset scroll position and mobile zoom after route changes (e.g. checkout → post-booking). */
export function scrollPageToTop(): () => void {
  const scrollTop = () => {
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }

  scrollTop()
  const rafId = requestAnimationFrame(scrollTop)

  const ae = document.activeElement
  if (ae instanceof HTMLElement) ae.blur()

  const vp = document.querySelector('meta[name="viewport"]')
  const defaultContent = 'width=device-width, initial-scale=1, viewport-fit=cover'
  let resetTimer: number | undefined
  if (vp) {
    vp.setAttribute('content', `${defaultContent}, maximum-scale=1`)
    resetTimer = window.setTimeout(() => {
      vp.setAttribute('content', defaultContent)
    }, 120)
  }

  return () => {
    cancelAnimationFrame(rafId)
    if (resetTimer !== undefined) window.clearTimeout(resetTimer)
    if (vp) vp.setAttribute('content', defaultContent)
  }
}
