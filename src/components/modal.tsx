import styled from 'styled-components';

/**
 * Modal Component
 * 
 * A reusable modal dialog component that displays messages to users with different types
 * (success, error, info). The modal includes an overlay, close button, and click-outside
 * functionality for better user experience.
 * 
 * @component
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 * 
 * <Modal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Success"
 *   message="Employee added successfully!"
 *   type="success"
 * />
 * ```
 */

interface ModalProps {
    /** Controls the visibility of the modal */
    isOpen: boolean;
    /** Callback function called when the modal should be closed */
    onClose: () => void;
    /** The title displayed in the modal header */
    title: string;
    /** The main message content displayed in the modal body */
    message: string;
    /** The type of modal which determines the icon color (success: green, error: red, info: blue) */
    type: 'success' | 'error' | 'info';
}

/**
 * Styled Components
 */

const Overlay = styled.div<{ $isOpen: boolean }>`
    position: fixed;
    inset: 0;
    display: ${props => props.$isOpen ? 'flex' : 'none'};
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 999;
`;

const ModalContent = styled.div`
    background-color: white;
    padding: 2rem;
    border-radius: 0.375rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    justify-content: center;
    align-items: center;
    position: relative;
    z-index: 1000;
`;

const CloseButton = styled.button`
    position: absolute;
    top: 0;
    right: 0;
    cursor: pointer !important;
    color: black;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    margin: 0 auto;
    background: none;
    border: none;
    font-size: 1.25rem;
    font-weight: bold;
    
    &:hover {
        opacity: 0.7;
    }
`;

const TitleContainer = styled.span`
    font-size: 1rem;
    text-align: center;
    color: black;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
`;

const MessageContainer = styled.span`
    font-size: 1rem;
    text-align: center;
    color: black;
`;

const IconWrapper = styled.svg<{ $type: 'success' | 'error' | 'info' }>`
    width: 2.5rem;
    height: 2.5rem;
    color: ${props => {
        switch (props.$type) {
            case 'success':
                return '#22c55e'; // green-500
            case 'error':
                return '#ef4444'; // red-500
            case 'info':
                return '#3b82f6'; // blue-500
            default:
                return '#3b82f6';
        }
    }};
`;

/**
 * Modal Component Implementation
 * 
 * Features:
 * - Fixed overlay with semi-transparent background
 * - Centered modal dialog with white background
 * - Close button in the top-right corner
 * - Click-outside-to-close functionality
 * - Type-based icon display (success, error, info)
 * - Responsive design with styled-components
 * 
 * @param props - The Modal component props
 * @returns JSX.Element - The rendered modal component
 */
export default function Modal({ isOpen, onClose, title, message, type }: ModalProps) {
    /**
     * Handles clicks on the modal overlay (outside the modal content).
     * Closes the modal when clicking on the backdrop, but not when clicking
     * inside the modal content itself.
     * 
     * @param e - The mouse event from clicking on the overlay
     */
    const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    }

    /**
     * Retrieves the appropriate icon based on the modal type.
     * 
     * @returns The SVG icon element for the current modal type
     */
    const getIcon = () => {
        return (
            <IconWrapper $type={type} viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
            </IconWrapper>
        );
    }

    return (
        <Overlay $isOpen={isOpen} onClick={handleClickOutside}>
            <ModalContent>
                <CloseButton onClick={onClose}>X</CloseButton>
                <TitleContainer>
                    {getIcon()}
                    {title}
                </TitleContainer>
                <MessageContainer>{message}</MessageContainer>
            </ModalContent>
        </Overlay>
    );
}

