import React from 'react';
import {X} from "lucide-react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
}

const Modal = ({ isOpen, onClose, children, title }: ModalProps) => {
    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={e => e.stopPropagation()}>
        <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={onClose}
        />
        <div className="relative z-50 w-full max-w-xl bg-white rounded-lg p-6">
            <div className="flex items center mb-4">
                {title && <h2 className="text-lg text-shakespeare-800 font-semibold">{title}</h2>}
                <div className="flex-grow" />
                <button onClick={onClose}
                        className="text-gray-500 hover:text-shakespeare-800 transition bg-gray-200 bg-opacity-0 hover:bg-opacity-100 px-1 py-1 rounded">
                    <X />
                </button>
            </div>

            <div className="max-h-64 overflow-y-auto">
                {children}
            </div>
        </div>
    </div>;
};

export default Modal;