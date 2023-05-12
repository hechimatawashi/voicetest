'use client';
import { useState, useEffect } from 'react';
import { synthesizeVoiceVox } from '../features/voicevox/voicevox';

const AudioPlayer = () => {
  const [text, setText] = useState<string>('');
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);

  useEffect(() => {
    setAudioCtx(new AudioContext());
  }, []);

  // 音声を生成し再生する
  const generateAndPlayAudio = () => {
    if (text !== '') {
      // AudioContextの初期化
      if (audioCtx === null) {
        const newAudioCtx = new AudioContext();
        setAudioCtx(newAudioCtx);
      }
      
      if (audioCtx !== null) {
        synthesizeVoiceVox(text)
          .then(data => {
            const audioBase64String = data.audio.split(",")[1];
            const audioBytes = atob(audioBase64String);
            const audioBuffer = new Uint8Array(audioBytes.length);
            for (let i = 0; i < audioBytes.length; i++) {
              audioBuffer[i] = audioBytes.charCodeAt(i);
            }
            audioCtx.decodeAudioData(audioBuffer.buffer, buffer => {
              const source = audioCtx.createBufferSource();
              source.buffer = buffer;
              source.connect(audioCtx.destination);
              source.start(0);
            });
          });
      }
    }
  }

  return (
    <div>
      <input type="text" value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={generateAndPlayAudio}>Generate and Play</button>
    </div>
  );
};

export default AudioPlayer;
