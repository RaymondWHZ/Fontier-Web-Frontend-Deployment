import React, {useEffect} from "react";
import Link from "next/link";
import Image from "next/image";

interface FontPreviewProps {
  font: FontOverview
  previewText: string
  fontSize: number
}

export const FontPreview: React.FC<FontPreviewProps> = ({ font, previewText, fontSize }) => {
  const [fontLoaded, setFontLoaded] = React.useState(false)

  useEffect(() => {
    setTimeout(async () => {
      const fontCSS = await fetch(`https://fonts.googleapis.com/css?family=${font.name}&display=block`)
      const style = document.createElement('style')
      style.innerHTML = await fontCSS.text()
      document.head.appendChild(style)
      setFontLoaded(true)
      return () => {
        document.head.removeChild(style)
      }
    }, 0)
  }, [font.name])

  if (!fontLoaded) return null

  return (
    <>
      <div className="flex flex-col items-stretch rounded-lg h-40 shadow-lg">
        <div className="bg-secondary-orange px-6 py-2 rounded-t-lg flex flex-row">
          <div className="grow">{font.displayName}</div>
          <Link href={font.downloadUrl}>
            <div className="flex flex-row items-center gap-2">
              <div>Download Font</div>
              <Image src="/download.svg" alt="download" width={16} height={16} />
            </div>
          </Link>
        </div>
        <div className="grow rounded-b-lg px-6 py-2 text-black" style={{ fontFamily: `${font.name}`, fontSize }}>
          {previewText}
        </div>
      </div>
    </>
  )
}

interface FontSizeSelectorProps {
  fontSize: number
  numFonts: number
  onChange: (fontSize: number) => void
}

export const FontSizeSelector: React.FC<FontSizeSelectorProps> = ({ fontSize, numFonts, onChange }) => {
  return (
    <div className="rounded-xl px-6 py-4 flex flex-row items-center shadow-lg gap-2">
      <div className="text-secondary-text w-12 text-right text-lg">{fontSize} px</div>
      <div className="w-60 flex flex-row items-center">
        <input
          className="slider"
          type="range"
          value={fontSize}
          min={0}
          max={96}
          onChange={e => onChange(Number(e.target.value))}
        />
      </div>
      <div className="grow" />
      <div>
        · {numFonts} Similar Fonts
      </div>
      <Image src="/color-ring.png" alt="" width={24} height={24} />
    </div>
  )
}

interface FontPreviewListProps {
  fonts: FontOverview[]
  previewText: string
}

export const FontPreviewList: React.FC<FontPreviewListProps> = ({ fonts, previewText }) => {
  const [fontSize, setFontSize] = React.useState(20)
  return (
    <div className="flex flex-col items-stretch gap-4">
      <FontSizeSelector fontSize={fontSize} numFonts={fonts.length} onChange={setFontSize} />
      {fonts.map((font, index) => (
        <FontPreview
          key={index}
          font={font}
          previewText={previewText ? previewText : "Discover Free Fonts with AI"}
          fontSize={fontSize}
        />
      ))}
    </div>
  )
}
