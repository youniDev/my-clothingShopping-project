// ImageComponent.js
import React from "react";
import { useDrag } from "react-dnd";

const ImageComponent = ({ image, index, onImageClick }) => {
  const [, drag] = useDrag({
    type: "IMAGE",
    item: { index },
  });

  return (
    <div
      ref={drag}
      onClick={() => onImageClick(index)}
      className="uploaded-image-container"
    >
      <img
        src={URL.createObjectURL(image)}
        alt={`Uploaded Image ${index + 1}`}
        className="uploaded-image"
      />
    </div>
  );
};

export default ImageComponent;
