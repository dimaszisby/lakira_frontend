interface ErrorMessageProps {
  message: string | null | undefined;
  className?: string;
}

function getBackgroundColor(message: string | null) {
  if (message === null || message === "") {
    return "bg-clear";
  } else {
    return "bg-red-100";
  }
}

const ErrorMessage = ({ message, className }: ErrorMessageProps) => {
  return (
    <div
      className={`w-full inline-block ${getBackgroundColor(
        message ?? null
      )} text-red-500 px-3 py-2 rounded ${className}`}
    >
      {(message !== null || message !== "") && (
        <p className="text-red-500 text-sm">{message}</p>
      )}
    </div>
  );
};

export default ErrorMessage;
