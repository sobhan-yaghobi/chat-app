"use client"

import React from "react"

import { ChevronDown } from "lucide-react"

import ColorList from "./ColorList"

const ChangeThemeList: React.FC = () => {
  return (
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn m-1">
        Theme
        <ChevronDown />
      </div>
      <ColorList />
    </div>
  )
}

export default ChangeThemeList
