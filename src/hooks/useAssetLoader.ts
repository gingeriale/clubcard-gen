import { useEffect, useState } from 'react';
import sampleBgSrc from '../assets/sampleBg.png';
import instaIconSrc from '../assets/insticonwhite.png';

export const useAssetLoader = () => {
  const [sampleBg, setSampleBg] = useState<HTMLImageElement | null>(null);
  const [instaIcon, setInstaIcon] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const loadImage = async (src: string): Promise<HTMLImageElement> => {
      const img = new Image();
      img.src = src;
      await img.decode();
      return img;
    };

    const loadAssets = async () => {
      const [bg, icon] = await Promise.all([
        loadImage(sampleBgSrc),
        loadImage(instaIconSrc)
      ]);
      setSampleBg(bg);
      setInstaIcon(icon);
    };
    
    loadAssets();
  }, []);

  return {
    sampleBg,
    instaIcon,
  };
};