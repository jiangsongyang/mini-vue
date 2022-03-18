import * as tools from '../src/tools'

describe('tools test', () => {
  it('test getTypeString function', () => {
    expect(tools.getTypeString('')).toBe(tools.TYPE_MAP['string'])
    expect(tools.getTypeString(0)).toBe(tools.TYPE_MAP['number'])
    expect(tools.getTypeString(false)).toBe(tools.TYPE_MAP['boolean'])
    expect(tools.getTypeString(null)).toBe(tools.TYPE_MAP['null'])
    expect(tools.getTypeString(undefined)).toBe(tools.TYPE_MAP['undefined'])
    expect(tools.getTypeString({})).toBe(tools.TYPE_MAP['object'])
    expect(tools.getTypeString([])).toBe(tools.TYPE_MAP['array'])
    expect(tools.getTypeString(() => {})).toBe(tools.TYPE_MAP['function'])
    expect(tools.getTypeString(Symbol(''))).toBe(tools.TYPE_MAP['symbol'])
  })

  it('test hasChanged', () => {
    expect(tools.hasChanged({}, { a: 1 })).toBeTruthy()
  })
})
