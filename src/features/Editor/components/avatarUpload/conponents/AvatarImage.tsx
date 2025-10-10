import styles from '../AvatarUpload.module.scss'
export default function AvatarImage({
  src,
  className,
}: {
  src: string
  className?: string
}) {
  return (
    <div className={`${styles.avatarpreview}`}>
      {src ? (
        <img src={src} alt="Avatar" className={`${styles.avatarimage}`} />
      ) : (
        <span className={`${styles.avatarplaceholder}`}>No image</span>
      )}
    </div>
  )
}
