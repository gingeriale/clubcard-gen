import { useEffect, useRef, useState } from "react";
import { jsPDF } from "jspdf";
import instaIconSrc from "./assets/insticonwhite.png"
import sampleBgSrc from "./assets/sampleBg.png"
import gothamProFontSrc from "./assets/GothaProBla.otf"

function parseNames(raw: string): string[] {
  return raw.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
}

function safeFilename(s: string): string {
  return (s || "card").replace(/[^\w-]+/g, "_").slice(0, 40);
}

export default function App() {

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [bg, setBg] = useState<HTMLImageElement | null>(null);
  const [sampleBg, setSampleBg] = useState<HTMLImageElement | null>(null);
  useEffect(() => {
    const loadSampleBg = async () => {
      const img = new Image();
      img.src = sampleBgSrc;
      await img.decode();
      setSampleBg(img);
    }
    loadSampleBg();
  }, []);

  const [instaIcon, setInstaIcon] = useState<HTMLImageElement | null>(null);
  useEffect(() => {
    const loadInstaIcon = async () => {
      const img = new Image();
      img.src = instaIconSrc;
      await img.decode();
      setInstaIcon(img);
    }
    loadInstaIcon();
  }, []);

  const [fontGothamProReady, setFontGothamReady] = useState<boolean>(false)
  useEffect(() => {
    const loadFont = async () => {
      const font = new FontFace("GothamPro", `url(${gothamProFontSrc})`);
      await font.load();
      document.fonts.add(font);
      await Promise.all([
        document.fonts.load(`normal 40px "GothamPro"`),
        document.fonts.load(`normal 30px "GothamPro"`),
      ]);
      setFontGothamReady(true);
    };
    loadFont()
  }, [])

  const fontWeight = "normal";
  const textAlignTitle = "center";
  const fillStyleWhite = "#ffffff";
  const textAlignContent = "left";
  const fillStyleYellowGreen = "#e9e9a7";

  const [rawNames, setRawNames] = useState("");
  const names = parseNames(rawNames);
  const previewName = names[0] ?? "";

  const [selectedYear, setSelectedYear] = useState<"current" | "next">("current");
  const [membershipType, setMembershipType] = useState<"Freediver" | "Snorkeller">("Freediver");

  const draw = (overrideName?: string) => {

    const canvas = canvasRef.current;
    if (!canvas || !fontGothamProReady) {
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    const displayName = (overrideName ?? previewName).trim()

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

    ctx.textBaseline = "middle";
    ctx.textAlign = textAlignTitle;
    ctx.font = `${fontWeight} ${fontSizeTitle}px GothamPro`;
    ctx.fillStyle = fillStyleWhite;
    ctx.fillText("Irish Freediving Club", canvas.width / 2, canvas.height / 6);

    ctx.textAlign = textAlignContent;
    ctx.font = `${fontWeight} ${fontSizeContent}px GothamPro`;
    ctx.fillStyle = fillStyleYellowGreen;
    ctx.fillText("Name:", canvas.width / 16, canvas.height / 2.5);
    ctx.fillText("Membership:", canvas.width / 16, canvas.height / 2);
    ctx.fillText("Expiry:", canvas.width / 16, canvas.height / 1.66);

    ctx.fillStyle = fillStyleWhite;
    ctx.fillText(displayName, canvas.width / 5, canvas.height / 2.5);
    ctx.fillText(membershipType, canvas.width / 3.2, canvas.height / 2);
    const todaysYear = new Date().getFullYear();
    ctx.fillText(`31.12.${selectedYear === "current" ? todaysYear : todaysYear + 1}`, canvas.width / 4.8, canvas.height / 1.66);
    ctx.fillText("irish_freediving_club", canvas.width / 8, canvas.height / 1.16)

  };

  useEffect(() => {

    draw();
  }, [
    fontGothamProReady,
    sampleBg,
    bg,
    instaIcon,
    previewName,
    membershipType,
    selectedYear,
    fontWeight,
    fillStyleWhite,
    fillStyleYellowGreen,
    textAlignTitle,
    textAlignContent
  ]);

  const onUpload = (file: File) => {

    const url = URL.createObjectURL(file);
    const bg = new Image();
    bg.onload = () => {

      setBg(bg);
    };
    bg.src = url;
  };

  const download = async () => {

    if (names.length === 0) {
      return;
    }
    if (!fontGothamProReady) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    for (const currentName of names) {

      draw(currentName);

      // just in case for repainting
      await new Promise(res => setTimeout(res, 10));

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [85, 54]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, 86, 54);

      const fileName = `MembershipCardIFC_${safeFilename(currentName)}`;
      pdf.save(fileName);

      // just in case for downloading sequence
      await new Promise(res => setTimeout(res, 10))
    };
  };

  return (
    <div className="min-h-screen bg-emerald-50 text-neutral-900 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl text-center">

        <h1 className="text-3xl md:text-4xl font-bold mb-8">
          Irish Freediving Club
          <br/>
          Membership Cards Generator
        </h1>

        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="p-6 bg-white rounded-2xl shadow w-full max-w-md mx-auto">

            <div className="relative w-full max-w-md mb-10"> {/* reserve space for hint */}
              <textarea
                className="w-full bg-transparent outline-none px-3 py-2 text-left resize-y"
                name="names"
                rows={4}
                value={rawNames}
                onChange={(e) => setRawNames(e.target.value)}
                placeholder="Enter name (or multiple names, comma or new line separated)"
              />
              <span className="pointer-events-none absolute left-0 right-0 bottom-0 h-px bg-clubgreen" />
              <span className="pointer-events-none absolute left-0 right-0 bottom-0 h-[2px] bg-clubgreen scale-x-0 focus-within:scale-x-100 transition-transform duration-150 origin-left" />
              <div className="absolute left-0 -bottom-5 text-xs sm:text-sm text-neutral-600">
                {names.length} card{names.length === 1 ? "" : "s"} will be generated
              </div>
            </div>

            <div className="flex justify-center gap-6 mb-4">
              <div className="font-bold">
                Year:
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="year"
                  value="current"
                  checked={selectedYear === "current"}
                  onChange={() => setSelectedYear("current")}
                  className="accent-clubgreen cursor-pointer"
                />
                Current
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="year"
                  value="next"
                  checked={selectedYear === "next"}
                  onChange={() => setSelectedYear("next")}
                  className="accent-clubgreen cursor-pointer"
                />
                Next
              </label>
            </div>

            <div className="flex justify-center gap-6 mb-6">
              <div className="font-bold">
                Membership type:
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="membership"
                  value="Freediver"
                  checked={membershipType === "Freediver"}
                  onChange={() => setMembershipType("Freediver")}
                  className="accent-clubgreen cursor-pointer"
                />
                Freediver
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="membership"
                  value="Snorkeller"
                  checked={membershipType === "Snorkeller"}
                  onChange={() => setMembershipType("Snorkeller")}
                  className="accent-clubgreen cursor-pointer"
                />
                Snorkeller
              </label>
            </div>

            <div className="flex justify-center mb-2">
              <div className="p-2 bg-white rounded-2xl text-center w-60">
                <h2 className="font-semibold mb-3">Upload background</h2>

                <label
                  htmlFor="fileUpload"
                  className="inline-block px-4 py-2 rounded-xl bg-clubgreen text-white cursor-pointer hover:opacity-90 transition"
                >
                  Choose Image
                </label>

                <input
                  id="fileUpload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) onUpload(f);
                  }}
                  className="hidden"
                />
              </div>
            </div>

          </div>
        </div>

        <div className="p-6 mb-4 w-full max-w-3xl mx-auto">
          <div className="mb-8 flex justify-center">
            <button
              onClick={download}
              disabled={names.length === 0}
              className={`px-4 py-2 rounded-xl text-white transition-colors ${parseNames(rawNames).length === 0 ? "bg-neutral-400 cursor-not-allowed" : "bg-clubgreen hover:opacity-90 cursor-pointer"}`}
            >
              Download PDF{names.length > 1 ? "s" : ""}
            </button>
          </div>

          <div className="rounded-2xl overflow-hidden border border-clubgreen w-full">
            <canvas ref={canvasRef} className="block w-full h-auto" />
          </div>
        </div>

      </div>
    </div>
  );
}
