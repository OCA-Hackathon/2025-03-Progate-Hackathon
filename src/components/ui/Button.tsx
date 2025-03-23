interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function Button({ children, ...props }: ButtonProps) {
  return (
    <button
      className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg flex items-center justify-center space-x-2"
      {...props}
    >
      {children}
    </button>
  );
}
