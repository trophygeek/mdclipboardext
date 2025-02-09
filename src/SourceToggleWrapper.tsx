/*
import { useCellValue, usePublisher } from '@mdxeditor/gurx'
import { SingleChoiceToggleGroup, viewMode$ } from '@mdxeditor/editor'
import { styles } from '@mdxeditor/editor/style.css'

export const DiffSourceToggleWrapper: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  // access the viewMode node value
  const viewMode = useCellValue(viewMode$)

  // a function that will publish a new value into the viewMode cell
  const changeViewMode = usePublisher(viewMode$)

  return (
    <>
      {viewMode === 'rich-text' ? (
        children
      ) : viewMode === 'diff' ? (
        <span className={styles.toolbarTitleMode}>Diff mode</span>
      ) : (
        <span className={styles.toolbarTitleMode}>Source mode</span>
      )}

      <div style={{ marginLeft: 'auto' }}>
        <SingleChoiceToggleGroup
          className={styles.diffSourceToggle}
          value={viewMode}
          items={
            [
              // { title: 'Rich text', contents: <RichTextIcon />, value: 'rich-text' },
              // { title: 'Diff mode', contents: <DiffIcon />, value: 'diff' },
              // { title: 'Source', contents: <SourceIcon />, value: 'source' }
            ]
          }
          onChange={(value) => changeViewMode(value || 'rich-text')}
        />
      </div>
    </>
  )
}
*/
