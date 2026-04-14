declare module 'react-simple-maps' {
  import { ComponentProps, ReactNode } from 'react'

  interface ProjectionConfig {
    center?: [number, number]
    scale?: number
    rotate?: [number, number, number]
  }

  interface ComposableMapProps extends ComponentProps<'svg'> {
    projection?: string
    projectionConfig?: ProjectionConfig
    viewBox?: string
    width?: number
    height?: number
  }

  interface GeographyStyle {
    fill?: string
    stroke?: string
    strokeWidth?: number
    outline?: string
    cursor?: string
  }

  interface GeographyProps extends ComponentProps<'path'> {
    geography: GeoFeature
    style?: {
      default?: GeographyStyle
      hover?: GeographyStyle
      pressed?: GeographyStyle
    }
  }

  interface GeoFeature {
    rsmKey: string
    properties: Record<string, unknown>
    [key: string]: unknown
  }

  interface GeographiesProps {
    geography: string | object
    children: (props: { geographies: GeoFeature[] }) => ReactNode
  }

  export function ComposableMap(props: ComposableMapProps): JSX.Element
  export function Geographies(props: GeographiesProps): JSX.Element
  export function Geography(props: GeographyProps): JSX.Element
}
