import {useEffect, useRef} from "react";
import { gauss, rgb_to_gray } from "./filters";

export default function Canvas(props) {
  const canvasRef = useRef()

  let offsetWidth = window.innerWidth;
  let offsetHeight = window.innerHeight;

  function updateScaleCanvas(canvas, image){
    const elem = document.getElementById('CanvasMain');  
    if(elem){   
        offsetWidth = elem.offsetWidth;
        offsetHeight = elem.offsetHeight;
    } 
    let fromHeight = offsetHeight * image.naturalWidth/image.naturalHeight;
    let fromWidth = offsetWidth * image.naturalHeight/image.naturalWidth;
    if(image.naturalHeight > image.naturalWidth){   
        if(fromHeight > offsetWidth) canvas.drawImage(image, 0, 0, offsetWidth, fromWidth);
        else canvas.drawImage(image, 0, 0, fromHeight, offsetHeight); 
    } else {
        if(fromWidth > offsetHeight) canvas.drawImage(image, 0, 0, fromHeight, offsetHeight);
        else  canvas.drawImage(image, 0, 0, offsetWidth, fromWidth);     
    }
  }

  function filtredCanvas(option){
    if(option.name === "Blur") 
        return gauss(canvasRef.current, option.value);
    if(option.name === "Grayscale" && option.value == 1)
        return rgb_to_gray(canvasRef.current);
  }

  useEffect(() => {

    if (canvasRef.current) {
      const canvas = canvasRef.current.getContext('2d');
 
      const image = new Image();
      
      image.onload = function () {
            canvas.clearRect(0, 0, window.innerWidth, window.innerHeight);
            updateScaleCanvas(canvas, image); 
            props.option.map((option, index) => {
                return filtredCanvas(option);
              })

      };
      image.src = URL.createObjectURL(props.image);
    } 
  }, [props, updateScaleCanvas])

  return (
    <>
      <canvas id = "CanvasMain" className="canvas" ref={canvasRef} width={offsetWidth} height={offsetHeight}/> 
    </>
  )
}