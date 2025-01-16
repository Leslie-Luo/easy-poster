const applyFont = (fontName: string, fontUrl: string) => {
  const fontFace = new FontFace(fontName, `url(${fontUrl})`)
  fontFace
    .load()
    .then((loadedFont) => {
      document.fonts.add(loadedFont)
    })
    .catch((error) => {
      console.error('应用字体失败:', error)
    })
}

export default applyFont
