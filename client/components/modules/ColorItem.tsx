type ColorItemProps = {
  themeName: string
  setTheme: React.Dispatch<React.SetStateAction<string>>
  colors: any
}

const ColorItem: React.FC<ColorItemProps> = ({ themeName, setTheme, colors }) => {
  return (
    <button
      key={themeName}
      style={{ background: colors["base-100"], color: colors["accent"] }}
      onClick={() => setTheme(themeName)}
      className="w-full mt-3 py-3 px-2 rounded-md flex justify-between"
    >
      <span>{themeName}</span>
      <ul className="flex">
        {Object.entries(colors).map(([_, value]) => (
          <li
            className="ml-1 h-5 w-3 rounded-md"
            style={{ background: typeof value === "string" ? value : "" }}
          />
        ))}
      </ul>
    </button>
  )
}

export default ColorItem
