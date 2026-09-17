import { useEffect } from "react";
import { CheckCircle2, CircleAlert, X } from "lucide-react";
import styles from "./Toast.module.css";

function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    if (!message) return undefined;

    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  const Icon = type === "error" ? CircleAlert : CheckCircle2;

  return (
    <div className={`${styles.toast} ${type === "error" ? styles.error : styles.success}`}>
      <Icon className={styles.icon} />
      <span>{message}</span>
      <button type="button" className={styles.closeButton} onClick={onClose} title="Fechar mensagem">
        <X />
      </button>
    </div>
  );
}

export default Toast;
