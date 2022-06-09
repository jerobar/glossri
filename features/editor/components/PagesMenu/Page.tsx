import styles from './PagesMenu.module.css'

export function Page(props: any) {
  const { provided, snapshot, page } = props

  return (
    <div
      className={styles.page}
      ref={provided.innerRef}
      {...provided.draggableProps}
    >
      <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }} {...provided.dragHandleProps}><strong>#</strong> {page.preview}</div>
    </div>
  )
}
