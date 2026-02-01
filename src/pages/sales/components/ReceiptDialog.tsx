import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import type { Receipt } from "../../../entities/Receipt";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import { FaEdit, FaPrint } from "react-icons/fa";
import ReceiptView from "../../../components/ReceiptView";
import { useTranslation } from "react-i18next";

interface ReceiptDialogProps {
  visible: boolean;
  onHide: () => void;
  receipt: Receipt;
}

export default function ReceiptDialog({
  visible,
  onHide,
  receipt,
}: ReceiptDialogProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
  const { t } = useTranslation();
  const footerContent = (
    <>
      <div className="m-2 inline-block">
        <Button
          className="bg-purple-700 text-white px-2 py-1 rounded-md"
          label={t("Close")}
          icon="pi pi-check"
          onClick={onHide}
          autoFocus
        />
      </div>
      <div className="m-2 inline-block">
        <Button
          className="bg-blue-400 px-2 py-1 rounded-md"
          icon={<FaPrint className="text-white" />}
          onClick={reactToPrintFn}
          autoFocus
        />
      </div>
      <div className="m-2 inline-block">
        {/* <Button
          className="bg-green-500 px-2 py-1 rounded-md"
          icon={<FaEdit className="text-white" />}
          onClick={onHide}
          autoFocus
        /> */}
      </div>
    </>
  );

  return (
    <Dialog
      className="bg-white/30 backdrop-blur-lg p-5 border-5 rounded-md border-success"
      visible={visible}
      modal
      footer={footerContent}
      style={{ width: "50rem" }}
      onHide={onHide}
    >
      <ReceiptView ref={contentRef} receipt={receipt} />
    </Dialog>
  );
}
