
interface AddEmployeeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddEmployeeModal({ isOpen, onClose }: AddEmployeeModalProps) {
    const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    }
    return (
        <div className={`fixed inset-0 flex items-center justify-center bg-black/40 ${isOpen ? 'block' : 'hidden'}`} onClick={handleClickOutside}>
            <div className="bg-white p-8 rounded-md flex flex-col gap-4 justify-center items-center relative">
               <button onClick={onClose} className="absolute top-0 right-0  cursor-pointer text-black px-4 py-2 rounded-md mx-auto">X</button>
               <span className=" text-md text-center text-black ">Employee added successfully !</span>
            </div>
        </div>
    );
}   

