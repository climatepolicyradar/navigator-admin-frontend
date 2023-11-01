import { IConfigGeographyNode, IConfigGeography } from '@/interfaces'

export function extractNestedGeographyData(data?: IConfigGeography[]): {
  regions: IConfigGeographyNode[]
  countries: IConfigGeographyNode[]
} {
  let regions: IConfigGeographyNode[] = []
  let countries: IConfigGeographyNode[] = []
  if (data) {
    regions = data.map((item) => {
      return item.node
    })
    countries = data
      .map((item) => {
        return item.children.map((item) => {
          return item.node
        })
      })
      .flat()
  }
  return { regions, countries }
}

export function getRegions(data?: IConfigGeography[]): IConfigGeographyNode[] {
  let regions: IConfigGeographyNode[] = []

  if (data) {
    regions = data.map((item) => {
      return item.node
    })
  }

  return regions
}

export function getCountries(
  data?: IConfigGeography[],
): IConfigGeographyNode[] {
  let countries: IConfigGeographyNode[] = []

  if (data) {
    countries = data
      .map((item) => {
        return item.children.map((item) => {
          return item.node
        })
      })
      .flat()

    countries.sort((a, b) => {
      if (a.display_value < b.display_value) {
        return -1
      }
      if (a.display_value > b.display_value) {
        return 1
      }
      return 0
    })
  }

  return countries
}
