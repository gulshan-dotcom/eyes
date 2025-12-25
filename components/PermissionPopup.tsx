import { motion, AnimatePresence } from "framer-motion";
import React from "react";

interface PermissionPopupProps {
  isOpen: boolean;
  onAllow: () => void;
  onLater: () => void;
}

export default function PermissionPopup({
  isOpen,
  onAllow,
  onLater,
}: PermissionPopupProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
        style={{
          position: "fixed",
          inset: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backdropFilter: "blur(14px)",
          background:
            "linear-gradient(135deg, rgba(179,137,255,0.24), rgba(255,168,188,0.22), rgba(152,199,255,0.25))",
          zIndex: 9999,
        }}
      >
        <motion.div
          initial={{ scale: 0.72, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.72, opacity: 0 }}
          transition={{ type: "spring", stiffness: 140, damping: 14 }}
          style={{
            width: "92%",
            maxWidth: "360px",
            padding: "26px",
            borderRadius: "18px",
            background: "rgba(255, 255, 255, 0.55)",
            backdropFilter: "blur(18px)",
            border: "1px solid rgba(255, 255, 255, 0.35)",
            boxShadow: "0 6px 28px rgba(0,0,0,0.12)",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontSize: "22px",
              fontWeight: 600,
              color: "rgb(35, 35, 35)",
              marginBottom: "12px",
              letterSpacing: "0.3px",
            }}
          >
            We are Verifying you as Human
          </h1>

          <p
            style={{
              fontSize: "15px",
              color: "rgba(30, 30, 30, 0.8)",
              lineHeight: "22px",
              marginBottom: "24px",
            }}
          >
            Please allow permissions to check Avaiblity of product and Verify Captha
          </p>

          {/* CTA Button */}
          <button
            onClick={onAllow}
            style={{
              width: "100%",
              padding: "13px 0",
              borderRadius: "12px",
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "15px",
              color: "#ffffff",
              background:
                "linear-gradient(135deg, rgb(141,90,255), rgb(238,96,152), rgb(83,140,255))",
              boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
              marginBottom: "12px",
              transition: "transform 0.18s ease",
            }}
            onMouseDown={(e) =>
              ((e.target as HTMLButtonElement).style.transform = "scale(0.96)")
            }
            onMouseUp={(e) =>
              ((e.target as HTMLButtonElement).style.transform = "scale(1)")
            }
          >
            Allow while using
          </button>

          {/* Later Button */}
          <button
            onClick={onLater}
            style={{
              width: "100%",
              padding: "11px 0",
              borderRadius: "12px",
              border: "1px solid rgba(50,50,50,0.18)",
              cursor: "pointer",
              background: "rgba(255,255,255,0.65)",
              fontSize: "14px",
              fontWeight: 500,
              color: "rgba(50,50,50,0.7)",
              transition: "background 0.2s ease",
            }}
            onMouseEnter={(e) =>
              ((e.target as HTMLButtonElement).style.background =
                "rgba(255,255,255,0.8)")
            }
            onMouseLeave={(e) =>
              ((e.target as HTMLButtonElement).style.background =
                "rgba(255,255,255,0.65)")
            }
          >
            Later
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
