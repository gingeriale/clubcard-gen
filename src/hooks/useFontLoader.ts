import { useEffect, useState } from 'react';
import gothamProFontSrc from '../assets/GothaProBla.otf';

export const useFontLoader = () => {
  const [fontGothamProReady, setFontGothamProReady] = useState<boolean>(false);

  useEffect(() => {
    const loadFont = async () => {
      const font = new FontFace('GothamPro', `url(${gothamProFontSrc})`);
      await font.load();
      document.fonts.add(font);
      await Promise.all([
        document.fonts.load(`normal 40px 'GothamPro'`),
        document.fonts.load(`normal 30px 'GothamPro'`),
      ]);
      setFontGothamProReady(true);
    };
    loadFont();
  }, []);

  return {
    fontGothamProReady,
  };
};