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
  return (
    <ComposableMap
      projection="geoMercator"
      projectionConfig={{ center: [136.5, 38], scale: 1700 }}
      viewBox="0 0 800 650"
      style={{ width: '100%', height: 'auto' }}
      aria-label="日本地図"
    >
      <Geographies geography={GEO_URL}>
        {({ geographies }) =>
          geographies.map((geo) => {
            const prefName = geo.properties.nam_ja as string
            const isActive = activePrefectures.has(prefName)
            const isSelected = selectedPrefecture === prefName

            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                onClick={() => onPrefectureClick(prefName)}
                role="button"
                aria-label={prefName}
                aria-pressed={isSelected}
                style={{
                  default: {
                    fill: isSelected
                      ? '#1D4ED8'
                      : isActive
                        ? '#3B82F6'
                        : '#D1D5DB',
                    stroke: '#FFFFFF',
                    strokeWidth: 0.5,
                    outline: 'none',
                    cursor: 'pointer',
                  },
                  hover: {
                    fill: isSelected
                      ? '#1E40AF'
                      : isActive
                        ? '#2563EB'
                        : '#9CA3AF',
                    stroke: '#FFFFFF',
                    strokeWidth: 0.5,
                    outline: 'none',
                    cursor: 'pointer',
                  },
                  pressed: {
                    fill: '#1D4ED8',
                    outline: 'none',
                  },
                }}
              />
            )
          })
        }
      </Geographies>
    </ComposableMap>
  )
}
