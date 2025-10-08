import { useEffect, useRef, useCallback } from 'react';
import { useAssetLoader, useFontLoader } from '../hooks';

interface CardPreviewProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  previewName: string;
  membershipType: 'Freediver' | 'Snorkeller';
  selectedYear: 'current' | 'next';
  bg: HTMLImageElement | null;
  onDraw?: (drawFunction: (overrideName?: string) => void) => void;
}

export default function CardPreview({
  canvasRef,
  previewName,
  membershipType,
  selectedYear,
  bg,
  onDraw,
}: CardPreviewProps) {
  const { sampleBg, instaIcon } = useAssetLoader();
  const { fontGothamProReady } = useFontLoader();
  
  const draw = useCallback((overrideName?: string) => {
    const canvas = canvasRef.current;
    if (!canvas || !fontGothamProReady) {
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!(ctx instanceof CanvasRenderingContext2D)) {
      return;
    }

    const displayName = (overrideName ?? previewName).trim();
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (bg) {
      canvas.width = bg.naturalWidth;
      canvas.height = bg.naturalHeight;
      ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
    }
    else if (sampleBg) {
      canvas.width = sampleBg.naturalWidth;
      canvas.height = sampleBg.naturalHeight;
      ctx.drawImage(sampleBg, 0, 0, canvas.width, canvas.height);
    }

    if (instaIcon) {
      ctx.drawImage(instaIcon, canvas.width / 18, canvas.height / 1.225, canvas.width / 17, canvas.width / 17);
    }

    const fontSizeTitle = canvas.width / 15;
    const fontSizeContent = canvas.width / 30;

    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.font = `normal ${fontSizeTitle}px GothamPro`;
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Irish Freediving Club', canvas.width / 2, canvas.height / 6);

    ctx.textAlign = 'left';
    ctx.font = `normal ${fontSizeContent}px GothamPro`;
    ctx.fillStyle = '#e9e9a7';
    ctx.fillText('Name:', canvas.width / 16, canvas.height / 2.5);
    ctx.fillText('Membership:', canvas.width / 16, canvas.height / 2);
    ctx.fillText('Expiry:', canvas.width / 16, canvas.height / 1.66);

    ctx.fillStyle = '#ffffff';
    ctx.fillText(displayName, canvas.width / 5, canvas.height / 2.5);
    ctx.fillText(membershipType, canvas.width / 3.2, canvas.height / 2);
    const todaysYear = new Date().getFullYear();
    ctx.fillText(`31.12.${selectedYear === 'current' ? todaysYear : todaysYear + 1}`, canvas.width / 4.8, canvas.height / 1.66);
    ctx.fillText('irish_freediving_club', canvas.width / 8, canvas.height / 1.16);
  }, [
    canvasRef,
    fontGothamProReady,
    previewName,
    membershipType,
    selectedYear,
    bg,
    sampleBg,
    instaIcon,
  ]);

  useEffect(() => {
    draw();
  }, [draw]);

  const onDrawRef = useRef(onDraw);
  onDrawRef.current = onDraw;

  useEffect(() => {
    if (onDrawRef.current) {
      onDrawRef.current(draw);
    }
  }, [draw]);

  return (
    <div className='rounded-2xl overflow-hidden border border-clubgreen w-full'>
      <canvas ref={canvasRef} className='block w-full h-auto' />
    </div>
  );
}