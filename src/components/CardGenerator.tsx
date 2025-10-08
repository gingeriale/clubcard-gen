import { useRef, useState, useCallback } from 'react';
import { jsPDF } from 'jspdf';
import { parseNames, safeFilename } from '../utils';
import { useFontLoader } from '../hooks';
import {
  NameInput,
  YearSelector,
  MembershipTypeSelector,
  FileUploader,
  DownloadButton,
  CardPreview
} from './';

export default function CardGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [bg, setBg] = useState<HTMLImageElement | null>(null);
  const { fontGothamProReady } = useFontLoader();
  const [rawNames, setRawNames] = useState('');
  const names = parseNames(rawNames);
  const previewName = names[0] ?? '';
  const [selectedYear, setSelectedYear] = useState<'current' | 'next'>('current');
  const [membershipType, setMembershipType] = useState<'Freediver' | 'Snorkeller'>('Freediver');
  const [drawFunction, setDrawFunction] = useState<((overrideName?: string) => void) | null>(null);

  const onUpload = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    const bg = new Image();

    bg.onload = () => {
      setBg(bg);
      URL.revokeObjectURL(url); // Clean up after load
    };
    
    bg.src = url;
  }, []);

  const handleDrawFunction = useCallback((drawFunc: (overrideName?: string) => void) => {
    setDrawFunction(() => drawFunc);
  }, []);

  const download = async () => {
    if (names.length === 0) {
      return;
    }
    if (!fontGothamProReady) {
      return;
    }
    if (!drawFunction) {
      console.error('drawFunction is not available');
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    for (const currentName of names) {
      drawFunction(currentName);

      // just in case for repainting
      await new Promise(res => setTimeout(res, 10));

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [85, 54]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, 86, 54);

      const fileName = `MembershipCardIFC_${safeFilename(currentName)}`;
      pdf.save(fileName);

      // just in case for downloading sequence
      await new Promise(res => setTimeout(res, 10));
    };
  };

  return (
    <div className='min-h-screen bg-emerald-50 text-neutral-900 flex items-center justify-center p-4'>
      <div className='w-full max-w-3xl text-center'>
        <h1 className='text-3xl md:text-4xl font-bold mb-8'>
          Irish Freediving Club
          <br/>
          Membership Cards Generator
        </h1>
        <div className='flex flex-col items-center gap-4 mb-8'>
          <div className='p-6 bg-white rounded-2xl shadow w-full max-w-md mx-auto'>
            <NameInput rawNames={rawNames} setRawNames={setRawNames} />
            <YearSelector selectedYear={selectedYear} setSelectedYear={setSelectedYear} />
            <MembershipTypeSelector membershipType={membershipType} setMembershipType={setMembershipType} />
            <FileUploader onUpload={onUpload} />
          </div>
        </div>
        <div className='p-6 mb-4 w-full max-w-3xl mx-auto'>
          <div className='mb-8 flex justify-center'>
            <DownloadButton onClick={download} names={names} rawNames={rawNames} />
          </div>
          <CardPreview
            canvasRef={canvasRef}
            previewName={previewName}
            membershipType={membershipType}
            selectedYear={selectedYear}
            bg={bg}
            onDraw={handleDrawFunction}
          />
        </div>
      </div>
    </div>
  );
}