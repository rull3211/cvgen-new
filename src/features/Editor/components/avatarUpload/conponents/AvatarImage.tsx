import styles from '../AvatarUpload.module.scss'
export default function AvatarImage({
  src,
  renderNoImage = true,
}: {
  src: string
  renderNoImage?: boolean
  className?: string
}) {
  const img = <img src={src} alt="Avatar" className={`${styles.avatarimage}`} />
  const fallback = renderNoImage && (
    <span className={`${styles.avatarplaceholder}`}>No image</span>
  )
  return src ? img : fallback
}
