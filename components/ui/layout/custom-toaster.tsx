import { CheckCheckIcon, XCircle } from "lucide-react";
import { Toaster } from "sonner";

export function CustomToaster() {
  return (
    <Toaster
      position="bottom-right"
      icons={{
        success: (
          <CheckCheckIcon color="green" strokeWidth={1} className="mr-4" />
        ),
        error: <XCircle color="red" strokeWidth={1} className="mr-4" />,
      }}
      toastOptions={{
        duration: 7500,
        style: {
          fontFamily: "NeueMontreal-Regular",
          background: "#242426",
          border: "1px solid rgba(169, 169, 169, 0.3)",
          borderRadius: "10px",
          padding: "1rem",
          color: "#fff",
        },
      }}
    />
  );
}
