import { useId, useRef, type ClipboardEvent, type KeyboardEvent } from 'react'
import './VerificationCodeInput.css'

const CODE_LENGTH = 6

type VerificationCodeInputProps = {
  id?: string
  value: string
  onChange: (code: string) => void
  onComplete?: (code: string) => void
  invalid?: boolean
  autoFocus?: boolean
}

export function VerificationCodeInput({
  id,
  value,
  onChange,
  onComplete,
  invalid = false,
  autoFocus = false,
}: VerificationCodeInputProps) {
  const groupId = useId()
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const chars = Array.from({ length: CODE_LENGTH }, (_, i) => value[i] ?? '')

  const emit = (next: string[]) => {
    const code = next.join('').slice(0, CODE_LENGTH)
    onChange(code)
    if (code.length === CODE_LENGTH) {
      onComplete?.(code)
    }
  }

  const focusAt = (index: number) => {
    const el = inputRefs.current[Math.max(0, Math.min(index, CODE_LENGTH - 1))]
    el?.focus()
    el?.select()
  }

  const handleCellChange = (index: number, raw: string) => {
    const cleaned = raw.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
    const next = [...chars]
    if (!cleaned) {
      next[index] = ''
      emit(next)
      return
    }
    let i = index
    for (const ch of cleaned) {
      if (i >= CODE_LENGTH) break
      next[i] = ch
      i += 1
    }
    emit(next)
    focusAt(Math.min(i, CODE_LENGTH - 1))
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !chars[index] && index > 0) {
      e.preventDefault()
      const next = [...chars]
      next[index - 1] = ''
      emit(next)
      focusAt(index - 1)
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault()
      focusAt(index - 1)
    }
    if (e.key === 'ArrowRight' && index < CODE_LENGTH - 1) {
      e.preventDefault()
      focusAt(index + 1)
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
    if (!pasted) return
    const next = Array.from({ length: CODE_LENGTH }, (_, i) => pasted[i] ?? '')
    emit(next)
    focusAt(Math.min(pasted.length, CODE_LENGTH) - 1)
  }

  return (
    <div
      id={id}
      className={`verifyCode${invalid ? ' verifyCode--invalid' : ''}`}
      role="group"
      aria-labelledby={groupId}
    >
      <span id={groupId} className="verifyCode__srOnly">
        Verification code, 6 characters
      </span>
      <div className="verifyCode__cells">
        {chars.map((ch, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el
            }}
            className={`verifyCode__cell${invalid && index === 0 ? ' verifyCode__cell--error' : ''}`}
            aria-invalid={invalid && index === 0 ? true : undefined}
            type="text"
            inputMode="text"
            autoComplete={index === 0 ? 'one-time-code' : 'off'}
            autoCapitalize="characters"
            autoCorrect="off"
            spellCheck={false}
            maxLength={CODE_LENGTH}
            value={ch}
            aria-label={`Character ${index + 1} of ${CODE_LENGTH}`}
            autoFocus={autoFocus && index === 0}
            onChange={(e) => handleCellChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={(e) => e.target.select()}
          />
        ))}
      </div>
    </div>
  )
}
