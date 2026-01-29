"use client";

import toast, { Toaster, ToastBar } from "react-hot-toast";

export default function Toast() {
  return (
    <>
      <button onClick={() => toast.success("Hello")}>Click me</button>
      <Toaster
        position="top-center"

        toastOptions={{
          duration: 3000,
        }}
      >
        {(t) => (
          <ToastBar
            toast={t}

          >
            {({ icon, message }) => (
              <div
                onClick={() => toast.dismiss(t.id)}
                style={{ cursor: "pointer", width: "100%" }}
              >
                {icon}
                {message}
              </div>
            )}
          </ToastBar>
        )}
      </Toaster>
    </>
  );
}
