export type GradientIconType =
  | "megaphone"
  | "trending"
  | "help"
  | "mail"
  | "whatsapp"
  | "instagram"
  | "tiktok"
  | "x"
  | "facebook"
  | "youtube"
  | "linkedin"
  | "search"
  | "mapPin"
  | "user"
  | "close"
  | "shieldCheck"
  | "plusCircle"
  | "chevronRight"
  | "wallet"
  | "fileText"
  | "messageSquare"
  | "settings"
  | "logOut"
  | "listFilter"
  | "handMetal"
  | "disc"
  | "music"
  | "radio"
  | "mic"
  | "camera"
  | "lock"
  | "ticket"
  | "calendar"
  | "users"
  | "shapes"
  | "armchair"
  | "navigation"
  | "mapPinned"
  | "chevronDown"
  | "arrowLeft";

type GradientIconProps = {
  type: GradientIconType;
  size?: number;
  /** Isi warna polos (mis. "#ffffff"). Kalau kosong, pakai gradasi ungu → pink. */
  color?: string;
};

export default function GradientIcon({
  type,
  size = 22,
  color,
}: GradientIconProps) {
  const gradientId = `gradient-${type}`;
  const stroke = color ?? `url(#${gradientId})`;
  const common = {
    stroke,
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  function renderIcon() {
    switch (type) {
      case "megaphone":
        return (
          <>
            <path
              d="M3 11V13C3 14.1 3.9 15 5 15H7L9 21H12L10 15L19 19V5L10 9H5C3.9 9 3 9.9 3 11Z"
              {...common}
            />
            <path d="M19 9C20.5 9.5 21 10.5 21 12S20.5 14.5 19 15" {...common} />
          </>
        );

      case "trending":
        return <path d="M3 17L9 11L13 15L21 7M15 7H21V13" {...common} />;

      case "help":
        return (
          <>
            <circle cx="12" cy="12" r="10" {...common} />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" {...common} />
            <path d="M12 17h.01" {...common} />
          </>
        );

      case "search":
        return (
          <>
            <circle cx="11" cy="11" r="8" {...common} />
            <path d="m21 21-4.3-4.3" {...common} />
          </>
        );

      case "mapPin":
        return (
          <>
            <path
              d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"
              {...common}
              fill={stroke}
            />
            <circle cx="12" cy="10" r="3" fill="#fff" stroke="none" />
          </>
        );

      case "user":
        return (
          <>
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" {...common} />
            <circle cx="12" cy="7" r="4" {...common} />
          </>
        );

      case "close":
        return (
          <>
            <path d="M18 6 6 18" {...common} />
            <path d="m6 6 12 12" {...common} />
          </>
        );

      case "shieldCheck":
        return (
          <>
            <path
              d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
              {...common}
            />
            <path d="m9 12 2 2 4-4" {...common} />
          </>
        );

      case "plusCircle":
        return (
          <>
            <circle cx="12" cy="12" r="10" {...common} />
            <path d="M8 12h8" {...common} />
            <path d="M12 8v8" {...common} />
          </>
        );

      case "chevronRight":
        return <path d="m9 18 6-6-6-6" {...common} />;

      case "wallet":
        return (
          <>
            <path
              d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"
              {...common}
            />
            <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" {...common} />
          </>
        );

      case "fileText":
        return (
          <>
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" {...common} />
            <path d="M14 2v4a2 2 0 0 0 2 2h4" {...common} />
            <path d="M10 9H8" {...common} />
            <path d="M16 13H8" {...common} />
            <path d="M16 17H8" {...common} />
          </>
        );

      case "messageSquare":
        return (
          <path
            d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
            {...common}
          />
        );

      case "settings":
        return (
          <>
            <path
              d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
              {...common}
              fill={stroke}
            />
            <circle cx="12" cy="12" r="3" fill="#fff" stroke="none" />
          </>
        );

      case "logOut":
        return (
          <>
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" {...common} />
            <path d="m16 17 5-5-5-5" {...common} />
            <path d="M21 12H9" {...common} />
          </>
        );

      case "listFilter":
        return (
          <>
            <path d="M3 6h18" {...common} />
            <path d="M7 12h10" {...common} />
            <path d="M10 18h4" {...common} />
          </>
        );

      case "handMetal":
        return (
          <>
            <path d="M18 12.5V10a2 2 0 0 0-2-2a2 2 0 0 0-2 2v1.4" {...common} />
            <path d="M14 11V9a2 2 0 1 0-4 0v2" {...common} />
            <path d="M10 10.5V5a2 2 0 1 0-4 0v9" {...common} />
            <path
              d="m7 15-1.76-1.76a2 2 0 0 0-2.83 2.82l3.6 3.6C7.5 21.14 9.2 22 12 22h2a8 8 0 0 0 8-8V7a2 2 0 1 0-4 0v5"
              {...common}
            />
          </>
        );

      case "disc":
        return (
          <>
            <circle cx="12" cy="12" r="10" {...common} />
            <path d="M6 12c0-1.7.7-3.2 1.8-4.2" {...common} />
            <circle cx="12" cy="12" r="2" {...common} />
            <path d="M18 12c0 1.7-.7 3.2-1.8 4.2" {...common} />
          </>
        );

      case "music":
        return (
          <>
            <circle cx="8" cy="18" r="4" {...common} />
            <path d="M12 18V2l7 4" {...common} />
          </>
        );

      case "radio":
        return (
          <>
            <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" {...common} />
            <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" {...common} />
            <circle cx="12" cy="12" r="2" {...common} />
            <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" {...common} />
            <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19" {...common} />
          </>
        );

      case "mic":
        return (
          <>
            <path
              d="m11 7.601-5.994 8.19a1 1 0 0 0 .1 1.298l.817.818a1 1 0 0 0 1.314.087L15.09 12"
              {...common}
            />
            <path
              d="M16.5 21.174C15.5 20.5 14.372 20 13 20c-2.058 0-3.928 2.356-6 2-2.072-.356-2.775-3.369-1.5-4.5"
              {...common}
            />
            <circle cx="16" cy="7" r="5" {...common} />
          </>
        );

      case "camera":
        return (
          <>
            <path
              d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"
              {...common}
            />
            <circle cx="12" cy="13" r="3" {...common} />
          </>
        );

      case "lock":
        return (
          <>
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" {...common} />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" {...common} />
          </>
        );

      case "ticket":
        return (
          <>
            <path
              d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"
              {...common}
            />
            <path d="M13 5v2" {...common} />
            <path d="M13 17v2" {...common} />
            <path d="M13 11v2" {...common} />
          </>
        );

      case "calendar":
        return (
          <>
            <rect x="3" y="4" width="18" height="18" rx="2" {...common} />
            <path d="M16 2v4" {...common} />
            <path d="M8 2v4" {...common} />
            <path d="M3 10h18" {...common} />
          </>
        );

      case "users":
        return (
          <>
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" {...common} />
            <circle cx="9" cy="7" r="4" {...common} />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" {...common} />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" {...common} />
          </>
        );

      case "shapes":
        return (
          <>
            <path
              d="M8.3 10a.7.7 0 0 1-.626-1.079L11.4 3a.7.7 0 0 1 1.198-.043L16.3 8.9a.7.7 0 0 1-.572 1.1Z"
              {...common}
            />
            <rect x="3" y="14" width="7" height="7" rx="1" {...common} />
            <circle cx="17.5" cy="17.5" r="3.5" {...common} />
          </>
        );

      case "armchair":
        return (
          <>
            <path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3" {...common} />
            <path
              d="M3 16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V11a2 2 0 0 0-4 0z"
              {...common}
            />
            <path d="M5 18v2" {...common} />
            <path d="M19 18v2" {...common} />
          </>
        );

      case "navigation":
        return <path d="M3 11 22 2 13 21 11 13 3 11z" {...common} />;

      case "mapPinned":
        return (
          <>
            <path
              d="M18 8c0 3.613-3.869 7.429-5.393 8.795a1 1 0 0 1-1.214 0C9.87 15.429 6 11.613 6 8a6 6 0 0 1 12 0"
              {...common}
            />
            <circle cx="12" cy="8" r="2" {...common} />
            <path
              d="M8.714 14h-3.71a1 1 0 0 0-.948.683l-2.004 6A1 1 0 0 0 3 22h18a1 1 0 0 0 .948-1.317l-2.005-6A1 1 0 0 0 19 14h-3.714"
              {...common}
            />
          </>
        );

      case "chevronDown":
        return <path d="m6 9 6 6 6-6" {...common} />;

      case "arrowLeft":
        return (
          <>
            <path d="m12 19-7-7 7-7" {...common} />
            <path d="M19 12H5" {...common} />
          </>
        );

      case "mail":
        return (
          <>
            <rect x="2" y="4" width="20" height="16" rx="2" {...common} />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" {...common} />
          </>
        );

      case "whatsapp":
        return (
          <>
            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" {...common} />
            <path
              d="M9 8.5c0 3.5 2.5 6.5 6.5 6.5l1-1.5-2-1-.8.8c-1-.4-2-1.4-2.4-2.4l.8-.8-1-2Z"
              {...common}
            />
          </>
        );

      case "instagram":
        return (
          <>
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" {...common} />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" {...common} />
            <path d="M17.5 6.5h.01" {...common} />
          </>
        );

      case "tiktok":
        return (
          <>
            <circle cx="8" cy="18" r="4" {...common} />
            <path d="M12 18V2l7 4" {...common} />
          </>
        );

      case "x":
        // Logo X versi solid, jadi pakai fill (bukan stroke)
        return (
          <path
            d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
            fill={stroke}
          />
        );

      case "facebook":
        return (
          <path
            d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
            {...common}
          />
        );

      case "youtube":
        return (
          <>
            <path
              d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"
              {...common}
            />
            <path d="m10 15 5-3-5-3z" {...common} />
          </>
        );

      case "linkedin":
        return (
          <>
            <path
              d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"
              {...common}
            />
            <rect x="2" y="9" width="4" height="12" {...common} />
            <circle cx="4" cy="4" r="2" {...common} />
          </>
        );
    }
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="0"
          y1="0"
          x2="24"
          y2="24"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#E91E8C" />
        </linearGradient>
      </defs>

      {renderIcon()}
    </svg>
  );
}