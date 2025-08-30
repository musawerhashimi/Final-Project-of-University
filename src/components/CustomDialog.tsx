import { Dialog } from "primereact/dialog";

interface DialogProps {
  visible: boolean;
  headerchildren: React.ReactNode;
  bodychildren: React.ReactNode;
  footerchildren: React.ReactNode;
  position:
    | "center"
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right";
  onHide: () => void;
}

export default function CustomDialog({
  visible,
  onHide,
  headerchildren,
  bodychildren,
  footerchildren,
  position,
}: DialogProps) {
  return (
    <Dialog
      position={position}
      className="bg-white p-5 border-2 shadow-md rounded-md border-success"
      visible={visible}
      modal
      header={headerchildren}
      footer={footerchildren}
      style={{ width: "50rem" }}
      onHide={onHide}
    >
      {bodychildren}
    </Dialog>
  );
}
