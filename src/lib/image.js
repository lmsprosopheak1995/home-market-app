// បង្រួមរូបភាពមុនរក្សាទុក ដើម្បីកុំឱ្យធំពេក
export function resizeImage(file, maxWidth = 1000, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('មិនអាចអានរូបភាពបានទេ'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('ឯកសារនេះមិនមែនជារូបភាពទេ'))
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width)
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}
