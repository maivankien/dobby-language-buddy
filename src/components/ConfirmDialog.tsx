import React from 'react'
import { X, AlertTriangle } from 'lucide-react'

interface ConfirmDialogProps {
    isOpen: boolean
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    onConfirm: () => void
    onCancel: () => void
    type?: 'danger' | 'warning' | 'info'
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    type = 'danger',
}) => {
    if (!isOpen) return null

    const getTypeStyles = () => {
        switch (type) {
            case 'danger':
                return {
                    icon: <AlertTriangle className="w-6 h-6 text-red-600" />,
                    confirmButton: 'bg-red-600 hover:bg-red-700 text-white',
                }
            case 'warning':
                return {
                    icon: <AlertTriangle className="w-6 h-6 text-yellow-600" />,
                    confirmButton: 'bg-yellow-600 hover:bg-yellow-700 text-white',
                }
            default:
                return {
                    icon: <AlertTriangle className="w-6 h-6 text-blue-600" />,
                    confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white',
                }
        }
    }

    const styles = getTypeStyles()

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-lg sm:rounded-xl shadow-xl max-w-md w-full animate-scaleIn">
                <div className="flex items-center justify-between p-4 sm:p-6 border-b">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                        {styles.icon}
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                            {title}
                        </h3>
                    </div>
                    <button
                        onClick={onCancel}
                        className="p-1 hover:bg-gray-100 rounded transition-colors cursor-pointer"
                    >
                        <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                    </button>
                </div>

                <div className="p-4 sm:p-6">
                    <p className="text-sm sm:text-base text-gray-700">{message}</p>
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 p-4 sm:p-6 border-t bg-gray-50">
                    <button
                        onClick={onCancel}
                        className="px-3 sm:px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base order-2 sm:order-1 cursor-pointer"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base order-1 sm:order-2 cursor-pointer ${styles.confirmButton}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    )
}
