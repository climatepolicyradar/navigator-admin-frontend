import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { setupUser } from '@/tests/helpers'
import { renderApp } from '@/tests/utilsTest/renderApp'
import { server } from '@/tests/mocks/server'

const USER_EMAIL = 'test.user@navigator.com'

describe('User page access', () => {
  it('is shown to superusers', async () => {
    setupUser({ isSuperuser: true })
    renderApp(`/user/${USER_EMAIL}`)

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: `Editing: ${USER_EMAIL}`,
      }),
    ).toBeInTheDocument()
  })

  it('redirects non-superusers to the dashboard', async () => {
    setupUser({ isSuperuser: false })
    renderApp(`/user/${USER_EMAIL}`)

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Dashboard' }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', {
        level: 1,
        name: `Editing: ${USER_EMAIL}`,
      }),
    ).not.toBeInTheDocument()
  })
})

describe('Reset user password', () => {
  const openConfirmDialog = async () => {
    await userEvent.click(
      await screen.findByRole('button', { name: 'Reset password' }),
    )
    return screen.findByRole('alertdialog', { name: 'Reset password?' })
  }

  const confirmReset = async () => {
    const dialog = await openConfirmDialog()
    await userEvent.click(
      within(dialog).getByRole('button', { name: 'Reset password' }),
    )
  }

  it('shows the reset password button to superusers', async () => {
    setupUser({ isSuperuser: true })
    renderApp(`/user/${USER_EMAIL}`)

    expect(
      await screen.findByRole('button', { name: 'Reset password' }),
    ).toBeInTheDocument()
  })

  it('asks for confirmation before resetting the password', async () => {
    let resetRequested = false
    server.use(
      http.post('*/v1/users/:email/password-reset', () => {
        resetRequested = true
        return HttpResponse.json({ password: 'generated-password-123' })
      }),
    )
    renderApp(`/user/${USER_EMAIL}`)

    const dialog = await openConfirmDialog()
    expect(dialog).toHaveTextContent(USER_EMAIL)

    await userEvent.click(
      within(dialog).getByRole('button', { name: 'Cancel' }),
    )

    await waitFor(() =>
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument(),
    )
    expect(resetRequested).toBe(false)
    expect(
      screen.queryByRole('dialog', { name: 'New password' }),
    ).not.toBeInTheDocument()
  })

  it('shows the new password after confirming', async () => {
    renderApp(`/user/${USER_EMAIL}`)

    await confirmReset()

    const modal = await screen.findByRole('dialog', { name: 'New password' })
    expect(modal).toHaveTextContent('generated-password-123')
    expect(
      within(modal).getByRole('button', { name: 'Copy password' }),
    ).toBeInTheDocument()
  })

  it('copies the new password to the clipboard', async () => {
    const user = userEvent.setup()
    renderApp(`/user/${USER_EMAIL}`)

    await user.click(
      await screen.findByRole('button', { name: 'Reset password' }),
    )
    const dialog = await screen.findByRole('alertdialog', {
      name: 'Reset password?',
    })
    await user.click(
      within(dialog).getByRole('button', { name: 'Reset password' }),
    )

    const modal = await screen.findByRole('dialog', { name: 'New password' })
    await user.click(
      within(modal).getByRole('button', { name: 'Copy password' }),
    )

    expect(
      within(modal).getByRole('button', { name: 'Copied' }),
    ).toBeInTheDocument()
    expect(await navigator.clipboard.readText()).toBe('generated-password-123')
  })

  it('clears the password when the modal is closed', async () => {
    renderApp(`/user/${USER_EMAIL}`)

    await confirmReset()
    const modal = await screen.findByRole('dialog', { name: 'New password' })

    await userEvent.click(within(modal).getByRole('button', { name: 'Done' }))

    await waitFor(() =>
      expect(
        screen.queryByRole('dialog', { name: 'New password' }),
      ).not.toBeInTheDocument(),
    )
    expect(screen.queryByText('generated-password-123')).not.toBeInTheDocument()
  })

  it('shows an error when the reset fails', async () => {
    server.use(
      http.post('*/v1/users/:email/password-reset', () =>
        HttpResponse.json(
          { detail: 'Could not reset password' },
          { status: 500 },
        ),
      ),
    )
    renderApp(`/user/${USER_EMAIL}`)

    await confirmReset()

    expect(
      await screen.findByText('Could not reset password'),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('dialog', { name: 'New password' }),
    ).not.toBeInTheDocument()
  })
})
