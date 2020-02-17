import React, {useRef, useEffect, useState} from 'react';

const RECORD_STATUS = {
  NOT_START: 1,
  RECORDING: 2,
  PAUSED: 3,
}

function RecordDesktop () {
  const [recordState, setRecordState] = useState(RECORD_STATUS.NOT_START);
  const [desktopStream, setDesktopStream] = useState(null);
  const [desktopRecorder, setDesktopRecorder] = useState(null);
  const desktopRef = useRef(null);
  const recordRef = useRef(null);
  const bufferRef = useRef([]);

  useEffect(() => {
    navigator.mediaDevices.getDisplayMedia({video: true})
      .then((stream) => {
        desktopRef.current.srcObject = stream;
        setDesktopStream(stream);
      })
  }, [])

  const handleLoadedMetadata = () => {
    desktopRef.current.play();
  }

  const handlePreviewRecordLoadedMetadata = () => {
    recordRef.current.play();
  }

  const handleStartRecord = () => {
    bufferRef.current = [];
    let mediaRecorder;
    const options = {
      mimeType: 'video/webm;codecs=vp8',
    }

    if(!MediaRecorder.isTypeSupported(options.mimeType)) {
      alert('not support');
      return;
    }

    try {
      mediaRecorder = new MediaRecorder(desktopStream, options);
      setDesktopRecorder(mediaRecorder);
      setRecordState(RECORD_STATUS.RECORDING);
    } catch (error) {
      alert('record failure');
    }

    mediaRecorder.ondataavailable = handleRecorderDataAvailable;

    mediaRecorder.start(10);
     
  }

  const handlePausedOrResumeRecord = () => {
    if(recordState === RECORD_STATUS.RECORDING) {
      desktopRecorder.pause();
      setRecordState(RECORD_STATUS.PAUSED);
    }

    if(recordState === RECORD_STATUS.PAUSED) {
      desktopRecorder.resume();
      setRecordState(RECORD_STATUS.RECORDING);
    }
  }

  const handleStopRecord = () => {
    desktopRecorder.stop();
    setRecordState(RECORD_STATUS.NOT_START);
  }

  const handleRecorderDataAvailable = (event) => {
    if(event?.data?.size) {
      bufferRef.current.push(event.data);
    }
  }

  const handlePreviewRecord = () => {
    const blob = new Blob(bufferRef.current, { type: 'video/webm'});
    recordRef.current.src = window.URL.createObjectURL(blob);
  }

  const handleDownloadRecord = () => {
    const blob = new Blob(bufferRef.current, { type: 'video/webm' });
    const a = document.createElement('a');
    a.download = 'video';
    a.href = window.URL.createObjectURL(blob);
    a.click();
  }



  return (
    <div>
      <div>
        <h3>捕获桌面</h3>
        <video ref={desktopRef} onLoadedMetadata={handleLoadedMetadata}></video>
      </div>
      <div>
        <button
          disabled={recordState !== RECORD_STATUS.NOT_START}
          onClick={handleStartRecord}
        >
          录制桌面
        </button>
        <button
          disabled={recordState === RECORD_STATUS.NOT_START}
          onClick={handlePausedOrResumeRecord}
        >
          {recordState === RECORD_STATUS.PAUSED ? '恢复录制' : '暂停录制'}
        </button>
        <button
          disabled={recordState === RECORD_STATUS.NOT_START}
          onClick={handleStopRecord}
        >
          停止录制
        </button>
      </div>

      <div>
        <button
          disabled={!bufferRef.current.length}
          onClick={handlePreviewRecord}
        >
          预览录制
        </button>
        <button
         disabled={!bufferRef.current.length}
         onClick={handleDownloadRecord}
         
         >下载录制</button>
        <div>
          <video ref={recordRef} onLoadedMetadata={handlePreviewRecordLoadedMetadata}></video>
        </div>
      </div>
    </div>
  )
}


export default RecordDesktop;
