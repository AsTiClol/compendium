// src/components/ui/dialog.jsx

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import "./dialog.css"; // <<<--- ENSURE THIS IMPORT IS PRESENT ---<<<

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay ref={ref} className={`fixedOverlay ${className || ""}`} {...props} />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content ref={ref} className={`dialogContent ${className || ""}`} {...props}>
      {children}
      <DialogPrimitive.Close className="dialogCloseButton">
        <X className="h-4 w-4" /><span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal >
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className, ...props }) => (<div className={`dialogHeader ${className || ""}`} {...props} />);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({ className, ...props }) => (<div className={`dialogFooter ${className || ""}`} {...props} />);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef(({ className, ...props }, ref) => ( <DialogPrimitive.Title ref={ref} className={`dialogTitle ${className || ""}`} {...props} /> ));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef(({ className, ...props }, ref) => ( <DialogPrimitive.Description ref={ref} className={`dialogDescription ${className || ""}`} {...props} /> ));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog, DialogPortal, DialogOverlay, DialogTrigger, DialogClose, DialogContent,
  DialogHeader, DialogFooter, DialogTitle, DialogDescription,
};