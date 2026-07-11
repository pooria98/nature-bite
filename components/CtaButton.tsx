interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}
const CtaButton = ({ children, className, ...props }: Props) => {
  return (
    <button
      className={`font-semibold min-w-30 rounded-full px-6 py-2 shadow-xs bg-linear-0 from-[#be9344] to-[#fce0ad] to-120% ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default CtaButton;
