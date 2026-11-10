"use client";
import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

interface MermaidDiagramProps {
  chart: string; // Đây là đoạn mã mermaid_code mà API trả về
}

/**
 * Làm sạch chuỗi Mermaid nếu Gemini vô tình bọc trong ```mermaid ... ```
 */
function sanitizeMermaidCode(raw: string): string {
  return raw
    .replace(/^```mermaid\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/, "")
    .trim();
}

export default function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const diagramRef = useRef<HTMLDivElement>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const cleanChart = sanitizeMermaidCode(chart);
    if (!cleanChart) return;

    mermaid.initialize({
      startOnLoad: false,
      theme: "base",
      securityLevel: "loose",
      themeVariables: {
        primaryColor: "#E0F2FE", // Xanh nhạt
        primaryTextColor: "#0F172A",
        primaryBorderColor: "#38BDF8",
        lineColor: "#94A3B8",
      },
    });

    const renderChart = async () => {
      try {
        setErrorMsg(null);
        const uniqueId = `mermaid-svg-${Math.random().toString(36).substring(2, 9)}`;
        const { svg } = await mermaid.render(uniqueId, cleanChart);
        if (isMounted && diagramRef.current) {
          diagramRef.current.innerHTML = svg;
        }
      } catch (err) {
        console.error("[Mermaid Render Error]:", err);
        if (isMounted) {
          setErrorMsg("Không thể vẽ sơ đồ từ cú pháp Mermaid này. Dưới đây là mã nguồn thô:");
        }
      }
    };

    renderChart();

    return () => {
      isMounted = false;
    };
  }, [chart]);

  return (
    <div className="w-full p-4 bg-white dark:bg-zinc-900 rounded-lg shadow-xs overflow-x-auto">
      {errorMsg ? (
        <div className="space-y-2 text-xs text-amber-600 dark:text-amber-400">
          <p className="font-medium">{errorMsg}</p>
          <pre className="p-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded overflow-x-auto">
            {sanitizeMermaidCode(chart)}
          </pre>
        </div>
      ) : (
        <div ref={diagramRef} className="mermaid flex justify-center min-h-[200px] items-center" />
      )}
    </div>
  );
}