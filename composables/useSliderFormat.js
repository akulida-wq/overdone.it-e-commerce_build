// R3.9 — locale-aware value formatting for the free continuous sliders:
// EN shows dollars ($840 / $87k / $1.2M), UA shows hryvnia («840 ₴ /
// 87 тис ₴ / 1,2 млн ₴») per the mockup's «₴, тыс/млн» format.
export function useSliderFormat() {
  const { lang } = useLang()

  const money = (v) => {
    if (lang.value === 'ua') {
      if (v >= 1e6) return (v / 1e6).toFixed(1).replace('.', ',').replace(',0', '') + ' млн ₴'
      if (v >= 1e3) return Math.round(v / 1e3) + ' тис ₴'
      return Math.round(v) + ' ₴'
    }
    if (v >= 1e6) return '$' + (v / 1e6).toFixed(1).replace('.0', '') + 'M'
    if (v >= 1e3) return '$' + Math.round(v / 1e3) + 'k'
    return '$' + Math.round(v)
  }

  const percent = (v) => Math.round(v) + '%'
  const integer = (v) => String(Math.round(v))

  return { money, percent, integer }
}
