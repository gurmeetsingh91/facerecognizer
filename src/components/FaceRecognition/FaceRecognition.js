import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({imageUrl,box}) => {

    const boxStyle ={
       top: box.topRow ,
       bottom: box.bottomRow ,
       left: box.leftCol,
       right: box.rightCol, 
    }

  return (
    <div className='center ma'>
        <div className='absolute mt2'>
            <img id='inputimage'
                alt=''
                width="500px"
                height="auto"
                src={imageUrl}
                />
            <div className='bounding-box' style={boxStyle}></div>
        </div>
    </div>
  );
}

export default FaceRecognition;