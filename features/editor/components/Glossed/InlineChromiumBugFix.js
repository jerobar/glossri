/**
 * Put this at the start and end of an inline component to work around this Chromium bug:
 * https://bugs.chromium.org/p/chromium/issues/detail?id=1249405
 */
 export function InlineChromiumBugFix() {
  return (
    <span
      contentEditable={false}
      style={{ fontSize: '0' }}
    >
      ${String.fromCodePoint(160) /* Non-breaking space */}
    </span>
  )
}
