import './WalletAddButtons.css'

function AppleWalletMark() {
  return (
    <svg
      className="walletAddBtn__mark"
      width="32"
      height="26"
      viewBox="0 0 32 26"
      fill="none"
      aria-hidden
    >
      <path
        d="M4 6.5h24a2.5 2.5 0 012.5 2.5v11a2.5 2.5 0 01-2.5 2.5H4A2.5 2.5 0 011.5 20V9A2.5 2.5 0 014 6.5z"
        fill="#F2F2F2"
      />
      <path d="M6 9h20v2.2H6V9z" fill="#F5A623" />
      <path d="M6 11.4h20v2H6v-2z" fill="#7ED321" />
      <path d="M6 13.6h20v2H6v-2z" fill="#4A90E2" />
      <path d="M6 15.8h20v2H6v-2z" fill="#D0021B" />
      <path
        d="M4 6.5h24a2.5 2.5 0 012.5 2.5v2H4A2.5 2.5 0 011.5 9v-2.5A2.5 2.5 0 014 6.5z"
        fill="#E8E8E8"
      />
    </svg>
  )
}

function GoogleWalletMark() {
  return (
    <svg
      className="walletAddBtn__mark"
      width="32"
      height="26"
      viewBox="0 0 32 26"
      fill="none"
      aria-hidden
    >
      <path
        d="M5 7c0-1.1.9-2 2-2h18c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2V7z"
        fill="#4285F4"
      />
      <path d="M7 9.5h18v1.8H7V9.5z" fill="#FBBC04" />
      <path d="M7 11.5h18v1.6H7v-1.6z" fill="#34A853" />
      <path d="M7 13.3h18v1.6H7v-1.6z" fill="#EA4335" />
      <path d="M7 15.1h18v1.6H7v-1.6z" fill="#9C27B0" />
      <path
        d="M5 7c0-1.1.9-2 2-2h18c1.1 0 2 .9 2 2v2.5H5V7z"
        fill="#5C9BF5"
      />
    </svg>
  )
}

export function WalletAddButtons() {
  return (
    <div className="orderConfirmWalletRow">
      <button type="button" className="walletAddBtn walletAddBtn--apple">
        <AppleWalletMark />
        <span className="walletAddBtn__text">
          <span className="walletAddBtn__sub">Add to</span>
          <span className="walletAddBtn__main">Apple Wallet</span>
        </span>
      </button>
      <button type="button" className="walletAddBtn walletAddBtn--google">
        <GoogleWalletMark />
        <span className="walletAddBtn__text">
          <span className="walletAddBtn__sub">Add to</span>
          <span className="walletAddBtn__main">Google Wallet</span>
        </span>
      </button>
    </div>
  )
}
