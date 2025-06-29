export default function BurgerIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path
        fill="#000"
        fillRule="evenodd"
        d="M3.5 5a1 1 0 0 0 0 2h17a1 1 0 1 0 0-2zm-1 7a1 1 0 0 1 1-1h17a1 1 0 1 1 0 2h-17a1 1 0 0 1-1-1m0 6.001a1 1 0 0 1 1-1h17a1 1 0 1 1 0 2h-17a1 1 0 0 1-1-1"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function CrossIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="25"
      viewBox="0 0 16 16"
    >
      <path
        fill="none"
        stroke="#000"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="m11.25 4.75l-6.5 6.5m0-6.5l6.5 6.5"
      />
    </svg>
  );
}

export function HeartIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path
        fill="#ff4739"
        fillOpacity="0"
        d="M12 8c0 0 0 0 0.76 -1c0.88 -1.16 2.18 -2 3.74 -2c2.49 0 4.5 2.01 4.5 4.5c0 0.93 -0.28 1.79 -0.76 2.5c-0.81 1.21 -8.24 9 -8.24 9c0 0 -7.43 -7.79 -8.24 -9c-0.48 -0.71 -0.76 -1.57 -0.76 -2.5c0 -2.49 2.01 -4.5 4.5 -4.5c1.56 0 2.87 0.84 3.74 2c0.76 1 0.76 1 0.76 1Z"
      >
        <animate
          fill="freeze"
          attributeName="fill-opacity"
          begin="0.7s"
          dur="0.5s"
          values="0;1"
        />
      </path>
      <path
        fill="none"
        stroke="#ff4739"
        strokeDasharray="32"
        strokeDashoffset="32"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 8c0 0 0 0 -0.76 -1c-0.88 -1.16 -2.18 -2 -3.74 -2c-2.49 0 -4.5 2.01 -4.5 4.5c0 0.93 0.28 1.79 0.76 2.5c0.81 1.21 8.24 9 8.24 9M12 8c0 0 0 0 0.76 -1c0.88 -1.16 2.18 -2 3.74 -2c2.49 0 4.5 2.01 4.5 4.5c0 0.93 -0.28 1.79 -0.76 2.5c-0.81 1.21 -8.24 9 -8.24 9"
      >
        <animate
          fill="freeze"
          attributeName="stroke-dashoffset"
          dur="0.7s"
          values="32;0"
        />
      </path>
    </svg>
  );
}

export function EyeCloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path
        fill="#ff4739"
        d="m9.343 18.782l-1.932-.518l.787-2.939a11 11 0 0 1-3.237-1.872l-2.153 2.154l-1.414-1.414l2.153-2.154a10.96 10.96 0 0 1-2.371-5.07l1.968-.359a9.002 9.002 0 0 0 17.713 0l1.968.358a10.96 10.96 0 0 1-2.372 5.071l2.154 2.154l-1.414 1.414l-2.154-2.154a11 11 0 0 1-3.237 1.872l.788 2.94l-1.932.517l-.788-2.94a11 11 0 0 1-3.74 0z"
      />
    </svg>
  );
}

export function EyeOpenIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path
        fill="#fff"
        d="M11.5 18c4 0 7.46-2.22 9.24-5.5C18.96 9.22 15.5 7 11.5 7s-7.46 2.22-9.24 5.5C4.04 15.78 7.5 18 11.5 18m0-12c4.56 0 8.5 2.65 10.36 6.5C20 16.35 16.06 19 11.5 19S3 16.35 1.14 12.5C3 8.65 6.94 6 11.5 6m0 2C14 8 16 10 16 12.5S14 17 11.5 17S7 15 7 12.5S9 8 11.5 8m0 1A3.5 3.5 0 0 0 8 12.5a3.5 3.5 0 0 0 3.5 3.5a3.5 3.5 0 0 0 3.5-3.5A3.5 3.5 0 0 0 11.5 9"
      />
    </svg>
  );
}

export function ClockIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 28 28"
    >
      <path
        fill="#ff8f15"
        d="M18.25 15.5h-5a.75.75 0 0 1-.75-.75v-7a.75.75 0 0 1 1.5 0V14h4.25a.75.75 0 0 1 0 1.5M14 2C7.372 2 2 7.373 2 14s5.372 12 12 12c6.627 0 12-5.373 12-12S20.627 2 14 2"
      />
    </svg>
  );
}

export function TickIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
    >
      <g
        fill="none"
        stroke="#32b266"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      >
        <path d="M10.25 2.75h-7.5v10.5h10.5v-3.5" />
        <path d="m5.75 7.75l2.5 2.5l6-6.5" />
      </g>
    </svg>
  );
}

export function CartIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path
        fill="#ff8f15"
        d="M0 1h4.764l.545 2h18.078l-3.666 11H7.78l-.5 2H22v2H4.72l1.246-4.989L3.236 3H0zm7.764 11h10.515l2.334-7H5.855zM4 21a2 2 0 1 1 4 0a2 2 0 0 1-4 0m14 0a2 2 0 1 1 4 0a2 2 0 0 1-4 0"
      />
    </svg>
  );
}

export function UserIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path
        fill="#ff8f15"
        d="M12 2a5 5 0 1 1 0 10a5 5 0 0 1 0-10m0 12c-4.418 0-8 2.239-8 5v3h16v-3c0-2.761-3.582-5-8-5z"
      />
    </svg>
  );
}

export function PencilIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path
        fill="#ff8f15"
        d="M4 21h4.586a1 1 0 0 0 .707-.293l11.5-11.5a1 1 0 0 0 0-1.414l-3.586-3.586a1 1 0 0 0-1.414 0l-11.5 11.5A1 1 0 0 0 4 16.414V21zm2-3.586l10.086-10.086l1.586 1.586L7.586 19H6v-1.586z"
      />
    </svg>
  );
}

export function Trash2Icon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path
        fill="#dc2626"
        d="M9 3v1H4v2h1v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6h1V4h-5V3H9zm2 4h2v10h-2V7zm-4 0h2v10H7V7zm8 0h2v10h-2V7z"
      />
    </svg>
  );
}
