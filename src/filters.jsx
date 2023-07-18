function makeGaussKernel(sigma){
    const GAUSSKERN = 6.0;
    var dim = parseInt(Math.max(3.0, GAUSSKERN * sigma));
    var sqrtSigmaPi2 = Math.sqrt(Math.PI*2.0)*sigma;
    var s2 = 2.0 * sigma * sigma;
    var sum = 0.0;
    
    var kernel = new Float32Array(dim - !(dim & 1));
    const half = parseInt(kernel.length / 2);
    for (var j = 0, i = -half; j < kernel.length; i++, j++) 
    {
        kernel[j] = Math.exp(-(i*i)/(s2)) / sqrtSigmaPi2;
        sum += kernel[j];
    }

    for (var i = 0; i < dim; i++) {
        kernel[i] /= sum;
    }
    return kernel;
    }
function gauss_internal(pixels, kernel, ch, gray){
    var data = pixels.data;
    var w = pixels.width;
    var h = pixels.height;
    var buff = new Uint8Array(w*h); 
    var mk = Math.floor(kernel.length / 2);
    var kl = kernel.length;
    
    for (var j = 0, hw = 0; j < h; j++, hw += w) 
    {
      for (var i = 0; i < w; i++)
      {
        var sum = 0;
        for (var k = 0; k < kl; k++)
        {
          var col = i + (k - mk);
          col = (col < 0) ? 0 : ((col >= w) ? w - 1 : col);
          sum += data[(hw + col)*4 + ch]*kernel[k];
        }
        buff[hw + i] = sum;
      }
    }
    
    for (var j = 0, offset = 0; j < h; j++, offset += w) 
    {
      for (var i = 0; i < w; i++)
      {
        var sum = 0;
        for (k = 0; k < kl; k++)
        {
          var row = j + (k - mk);
          row = (row < 0) ? 0 : ((row >= h) ? h - 1 : row);
          sum += buff[(row*w + i)]*kernel[k];
        }
        var off = (j*w + i)*4;
        (!gray) ? data[off + ch] = sum : 
                  data[off] = data[off + 1] = data[off + 2] = sum;
      }
    }
  }
  
 export function gauss(canvas, sigma){
    if(sigma != 0){
    var context = canvas.getContext('2d');
    var pixels = context.getImageData(0, 0, canvas.width, canvas.height);
    var kernel = makeGaussKernel(sigma);
    
    for (var ch = 0; ch < 3; ch++){
      gauss_internal(pixels, kernel, ch, false);
    }
    context.putImageData(pixels, 0, 0);
    }
  }

  export function rgb_to_gray(canvas){
    const context = canvas.getContext("2d");
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i+=4){
      const gray = ~~((data[i] + data[i + 1] + data[i + 2]) / 3);
      data[i] = data[i + 1] = data[i + 2] = gray;
    }
    context.putImageData(imageData, 0, 0);
  }