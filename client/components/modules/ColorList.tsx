"use client"

import React, { useLayoutEffect, useState } from "react"
import { colors } from "@/utils/colors"
import ColorItem from "./ColorItem"

const ColorList: React.FC = () => {
  const [theme, setTheme] = useState("")
  useLayoutEffect(() => {
    document.querySelector("html")!.setAttribute("data-theme", theme)
  }, [theme])

  return (
    <ul
      tabIndex={0}
      className="dropdown-content bg-base-200 text-base-content rounded-box top-px h-[28.6rem] max-h-[calc(100vh-10rem)] w-56 p-3 overflow-y-auto border border-white/5 shadow-2xl outline outline-1 outline-black/5 mt-16"
    >
      {Object.entries(colors).map(([_, themeColors]) =>
        Object.entries(themeColors).map(([themeName, colors]) => (
          <ColorItem themeName={themeName} setTheme={setTheme} colors={colors} />
        ))
      )}
    </ul>
  )
}

export default ColorList
