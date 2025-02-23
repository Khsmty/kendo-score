type Props = {
  className: string;
  size?: number;
  strokeWidth?: number;
};

export function CircleSvg(props: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size || 50}
      height={props.size || 50}
      viewBox="0 0 24 24"
      stroke="#000"
      strokeWidth={props.strokeWidth || 1}
      fill="none"
      className={props.className}
    >
      <title>円 (勝利)</title>
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}

export function SquareSvg(props: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size || 50}
      height={props.size || 50}
      viewBox="0 0 24 24"
      stroke="#000"
      strokeWidth={props.strokeWidth || 0.3}
      fill="none"
      className={props.className}
    >
      <title>四角 (引き分け)</title>
      <rect x="3" y="3" width="18" height="18" />
    </svg>
  );
}

export function TriangleSvg(props: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size || 50}
      height={props.size || 50}
      viewBox="0 0 24 24"
      stroke="#000"
      strokeWidth={props.strokeWidth || 1}
      fill="none"
      className={props.className}
    >
      <title>三角 (敗北)</title>
      <path d="M12 2 L22 21 L2 21 Z" />
    </svg>
  );
}
