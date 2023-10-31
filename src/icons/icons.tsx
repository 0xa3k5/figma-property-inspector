import { h } from "preact";

type SVGProps = React.SVGProps<SVGSVGElement>;

export const SelectIcon = (props: SVGProps) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M11.625 10.5V8.26875C9.8535 8.44425 8.445 9.8535 8.26875 11.625H10.5V12.375H8.26875C8.44425 14.1465 9.8535 15.555 11.625 15.7312V13.5H12.375V15.7312C14.1465 15.5557 15.555 14.1465 15.7312 12.375H13.5V11.625H15.7312C15.5557 9.8535 14.1465 8.445 12.375 8.26875V10.5H11.625ZM16.485 11.625C16.3042 9.43875 14.5612 7.69575 12.375 7.515V6H11.625V7.515C9.43875 7.69575 7.69575 9.43875 7.515 11.625H6V12.375H7.515C7.69575 14.5612 9.43875 16.3042 11.625 16.485V18H12.375V16.485C14.5612 16.3042 16.3042 14.5612 16.485 12.375H18V11.625H16.485Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const PaddingLeftIcon = (props: SVGProps) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M6 18V6H7V18H6ZM9 9H15V15H9V9ZM10 10V14H14V10H10Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const PaddingTopIcon = (props: SVGProps) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M6 6H18V7H6V6ZM9 9H15V15H9V9ZM10 10V14H14V10H10Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const PaddingRightIcon = (props: SVGProps) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M18 6V18H17V6H18ZM9 9H15V15H9V9ZM10 10V14H14V10H10Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const PaddingBottomIcon = (props: SVGProps) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M9 9H15V15H9V9ZM10 10V14H14V10H10ZM18 18H6V17H18V18Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const StrokeLeftIcon = (props: SVGProps) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M16.5 18H10V17H16.5C16.776 17 17 16.776 17 16.5V7.5C17 7.224 16.776 7 16.5 7H10V6H16.5C17.328 6 18 6.672 18 7.5V16.5C18 17.328 17.328 18 16.5 18Z"
        fill="currentColor"
        fill-opacity="0.3"
      />
      <path d="M6 18V6H7V18H6Z" fill="currentColor" />
    </svg>
  );
};
export const StrokeTopIcon = (props: SVGProps) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M6 16.5V10H7V16.5C7 16.776 7.224 17 7.5 17H16.5C16.776 17 17 16.776 17 16.5V10H18V16.5C18 17.328 17.328 18 16.5 18H7.5C6.672 18 6 17.328 6 16.5Z"
        fill="currentColor"
        fill-opacity="0.3"
      />
      <path d="M6 6H18V7H6V6Z" fill="currentColor" />
    </svg>
  );
};
export const StrokeRightIcon = (props: SVGProps) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M7.5 6H14V7H7.5C7.224 7 7 7.224 7 7.5V16.5C7 16.776 7.224 17 7.5 17H14V18H7.5C6.672 18 6 17.328 6 16.5V7.5C6 6.672 6.672 6 7.5 6Z"
        fill="currentColor"
        fill-opacity="0.3"
      />
      <path d="M18 6V18H17V6H18Z" fill="currentColor" />
    </svg>
  );
};

export const StrokeBottomIcon = (props: SVGProps) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M18 7.5V14H17V7.5C17 7.224 16.776 7 16.5 7H7.5C7.224 7 7 7.224 7 7.5V14H6V7.5C6 6.672 6.672 6 7.5 6H16.5C17.328 6 18 6.672 18 7.5Z"
        fill="currentColor"
        fill-opacity="0.3"
      />
      <path d="M18 18H6V17H18V18Z" fill="currentColor" />
    </svg>
  );
};

export const GapVerticalIcon = (props: SVGProps) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M17 19V17H7V19H6V16H18V19H17ZM18 9H6V6H7V8H17V6H18V9ZM15 13V12H9V13H15Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const GapHorizontalIcon = (props: SVGProps) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M18 7H16V17H18V18H15V6H18V7ZM8 6V18H5V17H7V7H5V6H8ZM12 9H11V15H12V9Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const RadiusTopLeftIcon = (props: SVGProps) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M6 12.75C6 9.0225 9.0225 6 12.75 6H18V7.5H12.75C9.8505 7.5 7.5 9.8505 7.5 12.75V18H6V12.75Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const RadiusTopRightIcon = (props: SVGProps) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M18 12.75C18 9.0225 14.9775 6 11.25 6H6V7.5H11.25C14.1495 7.5 16.5 9.8505 16.5 12.75V18H18V12.75Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const RadiusBottomLeftIcon = (props: SVGProps) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M6 11.25C6 14.9775 9.0225 18 12.75 18H18V16.5H12.75C9.8505 16.5 7.5 14.1495 7.5 11.25V6H6V11.25Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const RadiusBottomRightIcon = (props: SVGProps) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M18 11.25C18 14.9775 14.9775 18 11.25 18H6V16.5H11.25C14.1495 16.5 16.5 14.1495 16.5 11.25V6H18V11.25Z"
        fill="currentColor"
      />
    </svg>
  );
};
