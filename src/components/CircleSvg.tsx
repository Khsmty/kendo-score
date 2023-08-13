type Props = {
  className: string;
};

export function CircleSvg(props: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="50"
      height="50"
      viewBox="0 0 24 24"
      stroke="#000"
      strokeWidth="1"
      fill="none"
      className={props.className}
    >
      <circle cx="12" cy="12" r="10"></circle>
    </svg>
  );
}
