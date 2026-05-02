import { useState, useRef } from 'react';

export type ExportStatus = 'idle' | 'recording' | 'done' | 'error';

export function useVideoExport(
  audioStreamRef: React.MutableRefObject<MediaStream | null>,
  totalMs: number,
) {
  const [status, setStatus] = useState<ExportStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  async function startExport() {
    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: 30 } as MediaTrackConstraints,
        audio: false,
      });

      const tracks: MediaStreamTrack[] = [...displayStream.getVideoTracks()];
      const audioStream = audioStreamRef.current;
      if (audioStream) {
        tracks.push(...audioStream.getAudioTracks());
      }

      const combined = new MediaStream(tracks);

      const mimeType =
        MediaRecorder.isTypeSupported('video/mp4;codecs=avc1,mp4a') ? 'video/mp4;codecs=avc1,mp4a' :
        MediaRecorder.isTypeSupported('video/mp4') ? 'video/mp4' :
        MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus') ? 'video/webm;codecs=vp9,opus' :
        MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus') ? 'video/webm;codecs=vp8,opus' :
        'video/webm';

      const ext = mimeType.startsWith('video/mp4') ? 'mp4' : 'webm';

      const recorder = new MediaRecorder(combined, { mimeType });
      recorderRef.current = recorder;

      const chunks: BlobPart[] = [];
      recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };

      recorder.onstop = () => {
        displayStream.getTracks().forEach(t => t.stop());
        const blob = new Blob(chunks, { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `xcoms-launch.${ext}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setStatus('done');
        setTimeout(() => { setStatus('idle'); setProgress(0); }, 3000);
      };

      recorder.start(100);
      setStatus('recording');
      setProgress(0);
      setSecondsLeft(Math.ceil(totalMs / 1000));

      const start = Date.now();
      intervalRef.current = setInterval(() => {
        const elapsed = Date.now() - start;
        setProgress(Math.min(1, elapsed / totalMs));
        setSecondsLeft(Math.max(0, Math.ceil((totalMs - elapsed) / 1000)));
      }, 200);

      setTimeout(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setProgress(1);
        if (recorderRef.current?.state === 'recording') recorderRef.current.stop();
      }, totalMs);

    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  }

  function cancelExport() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (recorderRef.current?.state === 'recording') recorderRef.current.stop();
    setStatus('idle');
    setProgress(0);
  }

  return { status, progress, secondsLeft, startExport, cancelExport };
}
