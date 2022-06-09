import { useState, useCallback } from 'react'
/**
 * - Free Translation / Hide Free Translation toggle (visible only on hover)
 * - When not hovering, shows whether translation/audio has been added as icons
 * 
 */

export function FreeTranslation(props) {
  const [showFreeTranslation, setShowFreeTranslation] = useState(false)

  const toggleFreeTranslation = useCallback(() => {
    setShowFreeTranslation(!showFreeTranslation)
  }, [showFreeTranslation])

  return (
    <div
      className={`free-translation-container${showFreeTranslation ? ' show-free-translation' : ''}`}
    >
      <div className={'free-translation'}>
        *Free Translation editable, audio here*
      </div>
      <span 
        className={'free-translation-toggle'}
        onClick={() => toggleFreeTranslation()}
      >
        {showFreeTranslation ? 'Hide Free Translation' : 'Free Translation'}
      </span>
      {/* <span>Translation/Audio presence icons</span> */}
    </div>
  )
}
