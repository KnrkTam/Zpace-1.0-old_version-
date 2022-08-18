/* eslint-disable @typescript-eslint/no-use-before-define */
import React from 'react'
import styles from "../css/RenderPreview.module.css"


function RenderPreview(props:any) {

    const [preview, setPreview] = React.useState<string|undefined>(undefined)
    React.useEffect(() => {
        const objectUrl = URL.createObjectURL(props.render)
        setPreview(objectUrl)
        return () => URL.revokeObjectURL(objectUrl)
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])
      return (
        <div className={styles.renderPreviewContainer}>
          <img src={preview} className={styles.renderPreviewPic} alt="preview-pic"/>
        </div>
      )
}

export default RenderPreview
