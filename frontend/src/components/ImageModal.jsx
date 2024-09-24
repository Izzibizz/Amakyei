import { useRef, useEffect } from 'react';

export const ImageModal = ({ src, onClose, photographer }) => {
    const modalRef = useRef(null);
  
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
          onClose(); // Close the modal if clicked outside
        }
      };
  
      document.addEventListener("mousedown", handleClickOutside);
  
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [onClose]);
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 cursor-pointer">
        <div ref={modalRef} className="flex flex-col max-w-[90vw] max-h-[80vh]">
          <img
            src={src}
            alt={photographer}
            className="object-contain cursor-pointer rounded-xl max-w-[90vw] max-h-[80vh]"
            onClick={onClose}
          />
          {photographer && (
            <p className="font-body text-main-white p-4 ">
              Photographer: {photographer}
            </p>
          )}
        </div>
      </div>
    )
}