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
        center [138, 39.5], scale 2000, viewBox 0 0 800 780
        - 北海道北端 45.5°N → y≈108（上端から108px）
        - 北方領土 45.5°N+ → 同程度（北海道と重なる）
        - 屋久島 30.4°N → y≈778（下端ギリギリ）
      */}
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ center: [138, 39.5], scale: 2000 }}
        viewBox="0 0 800 780"
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
        - w-80 (320px) = 元の 2 倍サイズ
        - viewBox prop を渡すと react-simple-maps のプロジェクション計算は
          デフォルト 800×600 のまま、SVG だけ 240×155 にクリップされ沖縄が
          見えなくなるバグがあるため、width/height prop で渡す
        - width=320 height=200 → translate=[160,100]
        - center [126, 25.8], scale 960 で与那国〜沖縄本島〜南大東まで収める
      */}
      <div className="absolute top-2 left-2 w-80 bg-white/95 rounded-2xl border-2 border-[#FFD6E7] shadow-sm overflow-hidden">
        <p className="text-[10px] text-center text-[#8B6B8C] font-bold py-0.5 bg-[#FFF0F5]">
          沖縄県
        </p>
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ center: [126, 25.8], scale: 960 }}
          width={320}
          height={200}
          style={{ width: '100%', height: 'auto', display: 'block' }}
          aria-label="沖縄県"
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies
                .filter((geo) => geo.properties.nam_ja === '沖縄県')
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
      </div>
    </div>
  )
}
