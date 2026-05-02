export const CITIES = [
  { flag: '🇺🇸', countryName: 'USA',       stateCode: 'TX',  stateName: 'Texas',            label: 'Dallas, TX',   city: 'Dallas'   },
  { flag: '🇺🇸', countryName: 'USA',       stateCode: 'TX',  stateName: 'Texas',            label: 'Houston, TX',  city: 'Houston'  },
  { flag: '🇺🇸', countryName: 'USA',       stateCode: 'TX',  stateName: 'Texas',            label: 'Austin, TX',   city: 'Austin'   },
  { flag: '🇺🇸', countryName: 'USA',       stateCode: 'NY',  stateName: 'New York',         label: 'New York, NY', city: 'New York' },
  { flag: '🇺🇸', countryName: 'USA',       stateCode: 'CA',  stateName: 'California',       label: 'San Jose, CA', city: 'San Jose' },
  { flag: '🇺🇸', countryName: 'USA',       stateCode: 'WA',  stateName: 'Washington',       label: 'Seattle, WA',  city: 'Seattle'  },
  { flag: '🇺🇸', countryName: 'USA',       stateCode: 'IL',  stateName: 'Illinois',         label: 'Chicago, IL',  city: 'Chicago'  },
  { flag: '🇺🇸', countryName: 'USA',       stateCode: 'GA',  stateName: 'Georgia',          label: 'Atlanta, GA',  city: 'Atlanta'  },
  { flag: '🇨🇦', countryName: 'Canada',    stateCode: 'ON',  stateName: 'Ontario',          label: 'Toronto, ON',  city: 'Toronto'  },
  { flag: '🇨🇦', countryName: 'Canada',    stateCode: 'BC',  stateName: 'British Columbia', label: 'Vancouver, BC',city: 'Vancouver'},
  { flag: '🇦🇺', countryName: 'Australia', stateCode: 'NSW', stateName: 'New South Wales',  label: 'Sydney, NSW',  city: 'Sydney'   },
]

export const COUNTRIES = [
  { flag: '🇺🇸', name: 'USA' },
  { flag: '🇨🇦', name: 'Canada' },
  { flag: '🇦🇺', name: 'Australia' },
]

export function getStatesForCountry(countryName: string) {
  const seen = new Set<string>()
  return CITIES
    .filter(c => c.countryName === countryName)
    .filter(c => { if (seen.has(c.stateName)) return false; seen.add(c.stateName); return true })
    .map(c => ({ stateCode: c.stateCode, stateName: c.stateName }))
}

export function getCitiesForState(countryName: string, stateName: string) {
  return CITIES.filter(c => c.countryName === countryName && c.stateName === stateName)
}

export function buildGeoWhere(country?: string | null, state?: string | null, city?: string | null) {
  if (city)    return { city }
  if (state)   return { state }
  if (country) return { country }
  return {}
}

export function getLocationLabel(country?: string | null, state?: string | null, city?: string | null): string {
  if (city) {
    const match = CITIES.find(c => c.city === city)
    return match ? `${match.flag} ${match.label}` : `${city}`
  }
  if (state) {
    const match = CITIES.find(c => c.stateName === state)
    return match ? `${match.flag} ${state}` : state
  }
  if (country) {
    const match = COUNTRIES.find(c => c.name === country)
    return match ? `${match.flag} ${country}` : country
  }
  return '🌍 Everywhere'
}

export function getCountryFlag(countryName: string) {
  return COUNTRIES.find(c => c.name === countryName)?.flag ?? '🌍'
}

export function getCityFromLabel(label: string) {
  return CITIES.find(c => c.label === label) ?? CITIES[0]
}

export function formatCurrency(amount: number, countryName = 'USA') {
  if (countryName === 'Canada')    return `C$${amount.toLocaleString()}`
  if (countryName === 'Australia') return `A$${amount.toLocaleString()}`
  return `$${amount.toLocaleString()}`
}
