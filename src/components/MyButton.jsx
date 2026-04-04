export const MyButton = ({ className, func, children, text }) => {
  return (
    <button
      onClick={func}
      className={`shrink-0 h-[50px] flex items-center justify-center gap-2 text-white font-bold px-6 py-2 rounded-lg cursor-pointer ${className}`}
    >
      {children}
      {text}
    </button>
  );
};
