'use client'

import { ComposableMap, Geographies, Geography } from 'react-simple-maps'

const GEO_URL = '/japan.topojson'

interface Props {
  activePrefectures: Set<string>
  onPrefectureClick: (prefecture: string) => void
  selectedPrefecture: string | null
}

export function JapanMap({
  activePrefectures,
  onPrefectureClick,
  selectedPrefecture,
}: Props) {
  const getStyle = (prefName: string) => {
    const isActive = activePrefectures.has(prefName)
    const isSelected = selectedPrefecture === prefName
    return {
      default: {
        fill: isSelected ? '#E05A7A' : isActive ? '#FF8FAB' : '#F5E6F0',
        stroke: '#FFFFFF',
        strokeWidth: 0.5,
        outline: 'none',
        cursor: 'pointer',
      },
      hover: {
        fill: isSelected ? '#C84A6A' : isActive ? '#FF6B8A' : '#EDD5E8',
        stroke: '#FFFFFF',
        strokeWidth: 0.5,
        outline: 'none',
        cursor: 'pointer',
      },
      pressed: {
        fill: '#C84A6A',
        outline: 'none',
      },
    }
  }

  return (
    <div className="relative w-full">
      {/*
        メイン地図（沖縄を除く）
        center [138, 38], scale 2000, viewBox 0 0 800 740
        - 北海道北端 45.3°N → y≈32（上端付近）
        - 北方領土 45.5°N+ → y≈-8（範囲外・非表示）
        - 屋久島 30.4°N → y≈692（下端付近）
      */}
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ center: [138, 38], scale: 2000 }}
        viewBox="0 0 800 740"
        style={{ width: '100%', height: 'auto' }}
        aria-label="日本地図"
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies
              .filter((geo) => geo.properties.nam_ja !== '沖縄県')
              .map((geo) => {
                const prefName = geo.properties.nam_ja as string
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => onPrefectureClick(prefName)}
                    role="button"
                    aria-label={prefName}
                    aria-pressed={selectedPrefecture === prefName}
                    style={getStyle(prefName)}
                  />
                )
              })
          }
        </Geographies>
      </ComposableMap>

      {/*
        沖縄インセット（左上）
        center [126, 26], scale 2000, viewBox 0 0 240 155
        フィルタなし：投影の範囲内（沖縄諸島エリア）のみ自然に表示
        - 与那国島 123°E → x≈14（左端付近）
        - 宮古・八重山 125°E → x≈84
        - 沖縄本島 128°E → x≈190
        - 慶良間・久米島 126-127°E → x≈120-155
      */}
      <div className="absolute top-2 left-2 bg-white/95 rounded-2xl border-2 border-[#FFD6E7] shadow-sm overflow-hidden">
        <p className="text-[10px] text-center text-[#8B6B8C] font-bold py-0.5 px-3 bg-[#FFF0F5]">
          沖縄県
        </p>
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ center: [126, 26], scale: 2000 }}
          viewBox="0 0 240 155"
          style={{ width: 170, height: 'auto', display: 'block' }}
          aria-label="沖縄県"
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const prefName = geo.properties.nam_ja as string
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => onPrefectureClick(prefName)}
                    role="button"
                    aria-label={prefName}
                    aria-pressed={selectedPrefecture === prefName}
                    style={getStyle(prefName)}
                  />
                )
              })
            }
          </Geographies>
        </ComposableMap>
      </div>
    </div>
  )
}
