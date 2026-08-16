import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Input, Select, Textarea } from '@components/ui'

import { FormField } from './FormField'

describe('FormField', () => {
  it('associates the label with the control via the render-prop id', () => {
    render(<FormField label="Email">{(field) => <input {...field} type="email" />}</FormField>)
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
  })

  it('shows a decorative required indicator and marks aria-required', () => {
    render(
      <FormField label="Email" required>
        {(field) => <input {...field} type="email" />}
      </FormField>,
    )
    expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByLabelText(/Email/)).toHaveAttribute('aria-required', 'true')
  })

  it('connects hint text via aria-describedby', () => {
    render(
      <FormField label="Email" hint="We'll never share this">
        {(field) => <input {...field} type="email" />}
      </FormField>,
    )
    const input = screen.getByLabelText('Email')
    expect(screen.getByText("We'll never share this")).toHaveAttribute(
      'id',
      input.getAttribute('aria-describedby'),
    )
  })

  it('shows the error instead of the hint and sets aria-invalid', () => {
    render(
      <FormField label="Email" hint="We'll never share this" error="Email is required">
        {(field) => <input {...field} type="email" />}
      </FormField>,
    )
    const input = screen.getByLabelText('Email')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText('Email is required')).toBeInTheDocument()
    expect(screen.queryByText("We'll never share this")).not.toBeInTheDocument()
  })

  it('works with a non-input control via the render-prop', () => {
    render(
      <FormField label="Country">
        {(field) => (
          <select {...field}>
            <option value="us">United States</option>
          </select>
        )}
      </FormField>,
    )
    expect(screen.getByLabelText('Country')).toBeInTheDocument()
  })

  it('honors an explicit id and uses it for the label association', () => {
    render(
      <FormField label="Email" id="signup-email">
        {(field) => <input {...field} type="email" />}
      </FormField>,
    )
    const input = screen.getByLabelText('Email')
    expect(input).toHaveAttribute('id', 'signup-email')
  })

  // Regression coverage for the id/ARIA wiring across FormField's boundary
  // into each real `ui/` primitive — not just raw elements. Each primitive
  // sets its own `aria-describedby`/`aria-invalid` in JSX *before*
  // spreading `...props`, so FormField's render-prop values (which arrive
  // via that spread) must win. These tests catch a silent regression if a
  // primitive's JSX is ever reordered.
  describe('integration with ui/ primitives', () => {
    it('wires id, label, aria-required, and hint through Input', () => {
      render(
        <FormField label="Email" required hint="We'll never share this">
          {(field) => <Input {...field} type="email" />}
        </FormField>,
      )
      // exact-string match would miss the label's `*` required indicator
      // (still part of its accessible text content) — see the earlier
      // "shows a decorative required indicator" test for the same reason.
      const input = screen.getByLabelText(/Email/)
      expect(input).toHaveAttribute('aria-required', 'true')
      expect(screen.getByText("We'll never share this")).toHaveAttribute(
        'id',
        input.getAttribute('aria-describedby'),
      )
    })

    it('wires aria-invalid and the error message through Input', () => {
      render(
        <FormField label="Email" error="Email is required">
          {(field) => <Input {...field} type="email" />}
        </FormField>,
      )
      const input = screen.getByLabelText('Email')
      expect(input).toHaveAttribute('aria-invalid', 'true')
      expect(screen.getByText('Email is required')).toHaveAttribute(
        'id',
        input.getAttribute('aria-describedby'),
      )
    })

    it('wires id, label, aria-required, and hint through Select', () => {
      render(
        <FormField label="Country" required hint="Pick your billing country">
          {(field) => (
            <Select {...field}>
              <option value="us">United States</option>
            </Select>
          )}
        </FormField>,
      )
      const select = screen.getByLabelText(/Country/)
      expect(select).toHaveAttribute('aria-required', 'true')
      expect(screen.getByText('Pick your billing country')).toHaveAttribute(
        'id',
        select.getAttribute('aria-describedby'),
      )
    })

    it('wires aria-invalid and the error message through Select', () => {
      render(
        <FormField label="Country" error="Country is required">
          {(field) => (
            <Select {...field}>
              <option value="us">United States</option>
            </Select>
          )}
        </FormField>,
      )
      const select = screen.getByLabelText('Country')
      expect(select).toHaveAttribute('aria-invalid', 'true')
      expect(screen.getByText('Country is required')).toHaveAttribute(
        'id',
        select.getAttribute('aria-describedby'),
      )
    })

    it('wires id, label, aria-required, and hint through Textarea', () => {
      render(
        <FormField label="Bio" required hint="Shown on your public profile">
          {(field) => <Textarea {...field} />}
        </FormField>,
      )
      const textarea = screen.getByLabelText(/Bio/)
      expect(textarea).toHaveAttribute('aria-required', 'true')
      expect(screen.getByText('Shown on your public profile')).toHaveAttribute(
        'id',
        textarea.getAttribute('aria-describedby'),
      )
    })

    it('wires aria-invalid and the error message through Textarea', () => {
      render(
        <FormField label="Bio" error="Bio is required">
          {(field) => <Textarea {...field} />}
        </FormField>,
      )
      const textarea = screen.getByLabelText('Bio')
      expect(textarea).toHaveAttribute('aria-invalid', 'true')
      expect(screen.getByText('Bio is required')).toHaveAttribute(
        'id',
        textarea.getAttribute('aria-describedby'),
      )
    })
  })
})
