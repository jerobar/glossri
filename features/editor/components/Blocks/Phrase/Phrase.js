import { Editable } from '../../Editable'
import { FreeTranslation } from '../FreeTranslation'

export function Phrase(props) {
  const { block } = props

  return (
    <>
      <Editable block={block} type={'phrase'} />
      <FreeTranslation />
    </>
  )
}
