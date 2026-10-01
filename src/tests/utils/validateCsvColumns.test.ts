import { describe, expect, it } from 'vitest'

import {
  validateCsvColumns,
  REQUIRED_COLUMNS,
} from '@/utils/validateCsvColumns'

const COLUMNS: readonly string[] = REQUIRED_COLUMNS
const FIRST = COLUMNS[0]
const SECOND = COLUMNS[1]
const LAST = COLUMNS[COLUMNS.length - 1]
const PROVIDER = 'data_provider'

const missingMessage = (cols: readonly string[]) =>
  `Missing required columns: ${cols.join(', ')}`

/** A data row for the given header columns, with `provider` in data_provider. */
const dataRow = (columns: readonly string[], provider = 'Acme') =>
  columns
    .map((c) => (c.trim().toLowerCase() === PROVIDER ? provider : 'x'))
    .join(',')

/** A header line plus a valid first data row. */
const csv = (columns: readonly string[] = COLUMNS, provider = 'Acme') =>
  `${columns.join(',')}\n${dataRow(columns, provider)}\n`

const csvFile = (content: string, name = 'test.csv') =>
  new File([content], name, { type: 'text/csv' })

const run = (content: string) => validateCsvColumns(csvFile(content))
const messages = async (content: string) =>
  (await run(content)).errors.map((e) => e.message)

describe('header validation', () => {
  it('accepts a file with all required columns', async () => {
    expect((await run(csv())).errors).toEqual([])
  })

  it('allows extra columns and any column order', async () => {
    const cols = ['extra', ...[...COLUMNS].reverse()]
    expect((await run(csv(cols))).errors).toEqual([])
  })

  it('lists every missing column, in schema order', async () => {
    expect(await messages(`${FIRST}\nx\n`)).toEqual([
      missingMessage(COLUMNS.slice(1)),
    ])
  })

  it('reports a single missing column', async () => {
    const cols = COLUMNS.filter((c) => c !== LAST)
    expect(await messages(csv(cols))).toEqual([missingMessage([LAST])])
  })

  it('ignores case and surrounding whitespace', async () => {
    const cols = COLUMNS.map((c) => ` ${c.toUpperCase()} `)
    expect((await run(csv(cols))).errors).toEqual([])
  })

  it('strips a UTF-8 BOM', async () => {
    expect((await run(`\uFEFF${csv()}`)).errors).toEqual([])
  })

  it('reports duplicate columns once each, using the normalised name', async () => {
    const cols = [...COLUMNS, FIRST.toUpperCase(), FIRST]
    expect(await messages(csv(cols))).toEqual([`Duplicate columns: ${FIRST}`])
  })

  it('reports missing and duplicate problems together', async () => {
    const others = COLUMNS.filter((c) => c !== SECOND)
    expect(await messages(`${SECOND},${SECOND}\nx,x\n`)).toEqual([
      missingMessage(others),
      `Duplicate columns: ${SECOND}`,
    ])
  })

  it('tolerates a trailing comma in the header', async () => {
    expect(
      (await run(`${COLUMNS.join(',')},\n${dataRow(COLUMNS)},\n`)).errors,
    ).toEqual([])
  })

  it('tolerates an empty cell in the middle of the header', async () => {
    const cols = [COLUMNS[0], '', ...COLUMNS.slice(1)]
    expect((await run(csv(cols))).errors).toEqual([])
  })

  it('rejects a file whose first line is blank', async () => {
    expect(await messages(`\n${csv()}`)).toEqual([missingMessage(COLUMNS)])
  })

  it('handles quoted headers', async () => {
    const header = COLUMNS.map((c) => `"${c}"`).join(',')
    expect((await run(`${header}\n${dataRow(COLUMNS)}\n`)).errors).toEqual([])
  })

  it('rejects a zero-byte file', async () => {
    expect((await run('')).errors.length).toBeGreaterThan(0)
  })

  it('tags header problems with the "headers" field and no row', async () => {
    const [error] = (await run(`${FIRST}\nx\n`)).errors
    expect(error.field).toBe('headers')
    expect(error.row).toBeUndefined()
  })

  it('does not choke on a large file with a bad header', async () => {
    const cols = COLUMNS.filter((c) => c !== LAST)
    const rows = Array.from({ length: 20_000 }, () => dataRow(cols)).join('\n')
    expect(await messages(`${cols.join(',')}\n${rows}`)).toEqual([
      missingMessage([LAST]),
    ])
  })
})

describe('data_provider (first data row)', () => {
  it('returns the value from the first data row', async () => {
    expect(await run(csv(COLUMNS, 'Acme'))).toEqual({
      errors: [],
      dataProvider: 'Acme',
    })
  })

  it('trims whitespace but preserves case', async () => {
    expect((await run(csv(COLUMNS, '  Acme Corp  '))).dataProvider).toBe(
      'Acme Corp',
    )
  })

  it('handles a quoted value containing a comma', async () => {
    expect((await run(csv(COLUMNS, '"Acme, Inc"'))).dataProvider).toBe(
      'Acme, Inc',
    )
  })

  it('reads the right column whatever the column order', async () => {
    const cols = [...COLUMNS].reverse()
    expect((await run(csv(cols, 'Acme'))).dataProvider).toBe('Acme')
  })

  it('uses only the first data row', async () => {
    const content = `${csv(COLUMNS, 'First')}${dataRow(COLUMNS, 'Second')}\n${dataRow(COLUMNS, 'Third')}\n`
    expect((await run(content)).dataProvider).toBe('First')
  })

  it('blocks when data_provider is empty in the first row, pointing at row 2', async () => {
    const { errors, dataProvider } = await run(csv(COLUMNS, ''))
    expect(dataProvider).toBeUndefined()
    expect(errors).toEqual([
      {
        row: 2,
        field: PROVIDER,
        message:
          'data_provider is empty. It must be filled in on the first row.',
      },
    ])
  })

  it('treats a whitespace-only value as empty', async () => {
    expect((await run(csv(COLUMNS, '   '))).errors).toHaveLength(1)
  })

  it('treats a first row that is too short as empty', async () => {
    // data_provider is the last column, so a short row has no value for it
    const short = COLUMNS.slice(0, -1)
      .map(() => 'x')
      .join(',')
    const errors = (await run(`${COLUMNS.join(',')}\n${short}\n`)).errors
    expect(errors).toHaveLength(1)
    expect(errors[0].field).toBe(PROVIDER)
  })

  it('does not skip a blank line after the header: it counts as an empty first row', async () => {
    const content = `${COLUMNS.join(',')}\n\n${dataRow(COLUMNS, 'Acme')}\n`
    expect((await run(content)).errors).toHaveLength(1)
  })

  it('blocks a header-only file, since there is no data to read', async () => {
    const { errors } = await run(COLUMNS.join(','))
    expect(errors).toHaveLength(1)
    expect(errors[0].message).toMatch(/no data rows/)
  })

  it('reports a missing data_provider column as a header error, not a data error', async () => {
    const cols = COLUMNS.filter((c) => c !== PROVIDER)
    const { errors, dataProvider } = await run(csv(cols))
    expect(errors.map((e) => e.message)).toEqual([missingMessage([PROVIDER])])
    expect(dataProvider).toBeUndefined()
  })

  it('does not report data problems while headers are invalid', async () => {
    const cols = COLUMNS.filter((c) => c !== FIRST)
    const { errors } = await run(csv(cols, ''))
    expect(errors.map((e) => e.message)).toEqual([missingMessage([FIRST])])
  })
})
