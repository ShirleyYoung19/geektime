import React, {useRef, useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import { createPortal } from 'react-dom';

function App() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const previewRef = useRef(null);
  const bufferRef = useRef([]);
  // const [buffer, setBuffer] = useState([]);
  const [stream, setStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordState, setRecordState] = useState('pause');
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        width: 400,
        height: 300,
      }
    }).then(stream => {
      const video = videoRef.current;
      video.srcObject = stream;
      setStream(stream);
      // video.addEventListener("loadedmetadata", () => {
      //   video.play();
      // });
    })

  }, [])

  const handleTakePicture = () => {
    const canvas = canvasRef.current;
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0, 400, 300);
  }

  const handleSavePicture = () => {
    // const body = document.getElementsByTagName('body')[0];
    const a = document.createElement('a');
    // sconsole.log(a);
    a.download = 'photo';
    a.href = canvasRef.current.toDataURL();
    // createPortal(a, document.body);
    a.click();
    // a.remove();
  }

  const handleStartRecord = () => {
    console.log('start');
    bufferRef.current = [];
    const options = {
      mimeType: 'video/webm;codecs=vp8'
    }

    let mediaRecorder;

    if(!MediaRecorder.isTypeSupported(options.mimeType)) {
      console.error(`${options.mimeType} is not supported`);
    }
    try {
      mediaRecorder = new MediaRecorder(stream, options);
    } catch(e) {
      console.error('Failed to create MediaRecorder', e);
    }

    setMediaRecorder(mediaRecorder);
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.start(10);
    
  }

  const handleDataAvailable = (event) => {
    // console.log(event.data);
    // console.log(buffer);
    if(event?.data?.size) {
      bufferRef.current.push(event.data);
      // setBuffer(buffer);
    }
  }

  const handlePauseRecord = () => {
    if(recordState === 'pause') {
      mediaRecorder.pause();
      setRecordState('resume');
    } else if(recordState === 'resume') {
      mediaRecorder.resume();
      setRecordState('pause');
    }
   
  }

  const handleStopRecrod = () => {
    console.log(mediaRecorder);
    mediaRecorder.stop();
    setMediaRecorder(null);
    // setBuffer([]);
    // bufferRef.current = [];
    setRecordState('pause');
  }

  const handleDownloadRecord = () => {
    const blob = new Blob(bufferRef.current, {type: 'video/webm'});

    const a = document.createElement('a');
    a.download = 'preview';
    a.href = window.URL.createObjectURL(blob);

    a.click();
  }

  const handlePreviewRecord = () => {
    // console.log(buffer);
    const blob = new Blob(bufferRef.current, {type: 'video/webm'});
    previewRef.current.src = window.URL.createObjectURL(blob);
    previewRef.current.play();
  }

  
  return (
    <div className="App">
      <video ref={videoRef} autoPlay playsInline></video>
      {/* <button id="take" onClick={handleTakePicture}>拍照</button>
      <canvas ref={canvasRef} width="400" height="300"/>
      <button id="save" onClick={handleSavePicture}>保存</button> */}

      <div>
        <h3>录制</h3>
          <button type="button" onClick={handleStartRecord}>录制</button>
          <button onClick={handlePauseRecord} disabled={!mediaRecorder}>
            {recordState === 'pause' ? '暂停' : '继续'}
          </button>
          <button onClick={handleStopRecrod} disabled={!mediaRecorder}>结束</button>
          <button onClick={handleDownloadRecord} disabled={!bufferRef.current.length}>下载</button>
          <button onClick={handlePreviewRecord} disabled={!bufferRef.current.length}>预览</button>
         <br/>
          <video style={{width: '400px'}} controls ref={previewRef}></video>
      </div>
    </div>
  );
}

export default App;
