import { describe, expect, it } from 'vitest'

import {
  validateCsvColumns,
  REQUIRED_COLUMNS,
} from '@/utils/validateCsvColumns'

const COLUMNS: readonly string[] = REQUIRED_COLUMNS
const FIRST = COLUMNS[0]
const SECOND = COLUMNS[1]
const LAST = COLUMNS[COLUMNS.length - 1]

const VALID_HEADER = COLUMNS.join(',')
const missingMessage = (cols: readonly string[]) =>
  `Missing required columns: ${cols.join(', ')}`

const csvFile = (content: string, name = 'test.csv') =>
  new File([content], name, { type: 'text/csv' })

const messages = async (content: string) =>
  (await validateCsvColumns(csvFile(content))).map((e) => e.message)

describe('validateCsvColumns', () => {
  it('accepts a file with all required columns', async () => {
    expect(await messages(`${VALID_HEADER}\n`)).toEqual([])
  })

  it('accepts a header-only file with no trailing newline', async () => {
    expect(await messages(VALID_HEADER)).toEqual([])
  })

  it('allows extra columns and any column order', async () => {
    const header = ['extra', ...[...COLUMNS].reverse()].join(',')
    expect(await messages(`${header}\n`)).toEqual([])
  })

  it('lists every missing column, in schema order', async () => {
    expect(await messages(`${FIRST}\n`)).toEqual([
      missingMessage(COLUMNS.slice(1)),
    ])
  })

  it('reports a single missing column', async () => {
    const header = COLUMNS.filter((c) => c !== LAST).join(',')
    expect(await messages(`${header}\n`)).toEqual([missingMessage([LAST])])
  })

  it('ignores case and surrounding whitespace', async () => {
    const header = COLUMNS.map((c) => ` ${c.toUpperCase()} `).join(',')
    expect(await messages(`${header}\n`)).toEqual([])
  })

  it('strips a UTF-8 BOM', async () => {
    expect(await messages(`\uFEFF${VALID_HEADER}\n`)).toEqual([])
  })

  it('reports duplicate columns once each, using the normalised name', async () => {
    const header = `${VALID_HEADER},${FIRST.toUpperCase()},${FIRST}`
    expect(await messages(`${header}\n`)).toEqual([
      `Duplicate columns: ${FIRST}`,
    ])
  })

  it('reports missing and duplicate problems together', async () => {
    const others = COLUMNS.filter((c) => c !== SECOND)
    expect(await messages(`${SECOND},${SECOND}\n`)).toEqual([
      missingMessage(others),
      `Duplicate columns: ${SECOND}`,
    ])
  })

  it('tolerates a trailing comma in the header', async () => {
    expect(await messages(`${VALID_HEADER},\n`)).toEqual([])
  })

  it('tolerates an empty cell in the middle of the header', async () => {
    const [first, ...rest] = COLUMNS
    expect(await messages(`${first},,${rest.join(',')}\n`)).toEqual([])
  })

  it('rejects a file whose first line is blank', async () => {
    expect(await messages(`\n${VALID_HEADER}\n`)).toEqual([
      missingMessage(COLUMNS),
    ])
  })

  it('does not choke on a large file with a bad header', async () => {
    const header = COLUMNS.filter((c) => c !== LAST).join(',')
    const width = COLUMNS.length - 1
    const rows = Array.from({ length: 20_000 }, (_, i) =>
      Array.from({ length: width }, (__, col) => `r${i}c${col}`).join(','),
    ).join('\n')
    expect(await messages(`${header}\n${rows}`)).toEqual([
      missingMessage([LAST]),
    ])
  })

  it('handles quoted headers', async () => {
    const header = COLUMNS.map((c) => `"${c}"`).join(',')
    expect(await messages(`${header}\n`)).toEqual([])
  })

  it('rejects a zero-byte file', async () => {
    expect((await validateCsvColumns(csvFile(''))).length).toBeGreaterThan(0)
  })

  it('tags header problems with the "headers" field and no row', async () => {
    const [error] = await validateCsvColumns(csvFile(`${FIRST}\n`))
    expect(error.field).toBe('headers')
    expect(error.row).toBeUndefined()
  })
})
