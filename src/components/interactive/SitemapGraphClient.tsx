"use client";

import React, { useEffect, useState, useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';

// Dynamically import react-force-graph-2d since it relies on window/canvas
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });

interface SitemapGraphClientProps {
  dict: import('@/components/layout/Translator').TranslationDict;
  lang: string;
}

interface GraphNode {
  id: string;
  name: string;
  val: number;
  color: string;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

interface ForceGraphMethods {
  centerAt: (x: number, y: number, durationMs?: number) => void;
  zoom: (scale: number, durationMs?: number) => void;
  zoomToFit: (durationMs?: number, padding?: number, nodeFilter?: (node: GraphNode) => boolean) => void;
}

export default function SitemapGraphClient({ dict, lang }: SitemapGraphClientProps) {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const graphRef = useRef<ForceGraphMethods | undefined>(undefined);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [lockedNode, setLockedNode] = useState<GraphNode | null>(null);
  const initialCenterDone = useRef(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Auto-resize graph to fit container
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
        // Auto-recenter if we already did initial center
        if (initialCenterDone.current && graphRef.current) {
          setTimeout(() => {
            if (graphRef.current) graphRef.current.zoomToFit(400, 20);
          }, 50);
        }
      }
    };
    
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    
    const observer = new ResizeObserver(() => {
      // Use requestAnimationFrame to avoid ResizeObserver loop limit error
      window.requestAnimationFrame(() => {
        updateDimensions();
        checkMobile();
      });
    });
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
      window.requestAnimationFrame(() => {
        updateDimensions();
      });
    }
    
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = mounted && currentTheme === 'dark';

  // Define the site architecture as nodes and links
  const graphData = useMemo(() => {
    const nodes = [
      { id: '/', name: dict.Home || 'Home', val: 20, color: isDark ? '#3b82f6' : '#2563eb' }, // root
      
      { id: '/identity', name: dict.Identity || 'Identity', val: 10, color: isDark ? '#10b981' : '#059669' },
      { id: '/website', name: dict.Website || 'Website', val: 10, color: isDark ? '#10b981' : '#059669' },
      { id: '/feedback', name: dict.Feedback || 'Feedback', val: 10, color: isDark ? '#10b981' : '#059669' },
      
      { id: '/portfolio', name: dict.Portfolio || 'Portfolio', val: 15, color: isDark ? '#8b5cf6' : '#7c3aed' },
      { id: '/all', name: dict.All || 'All', val: 10, color: isDark ? '#8b5cf6' : '#7c3aed' },
      { id: '/social', name: dict.Social || 'Social', val: 10, color: isDark ? '#8b5cf6' : '#7c3aed' },
      { id: '/certificate', name: dict.Certificate || 'Certificate', val: 10, color: isDark ? '#8b5cf6' : '#7c3aed' },
      { id: '/news', name: dict.News || 'News', val: 10, color: isDark ? '#8b5cf6' : '#7c3aed' },

      { id: '/work', name: dict.Work || 'Work', val: 12, color: isDark ? '#f59e0b' : '#d97706' },
      { id: '/project', name: dict.Project || 'Project', val: 12, color: isDark ? '#f59e0b' : '#d97706' },
      { id: '/organization', name: dict.Organization || 'Organization', val: 12, color: isDark ? '#f59e0b' : '#d97706' },
      { id: '/award', name: dict.Award || 'Award', val: 12, color: isDark ? '#f59e0b' : '#d97706' },
      { id: '/hire-me', name: dict.Hire_Me || 'Hire Me', val: 12, color: isDark ? '#ef4444' : '#dc2626' },

      { id: '/music', name: dict.Music || 'Music', val: 10, color: isDark ? '#ec4899' : '#db2777' },
      { id: '/literature', name: dict.Literature || 'Literature', val: 10, color: isDark ? '#ec4899' : '#db2777' },

      { id: '/college', name: dict.College || 'College', val: 10, color: isDark ? '#14b8a6' : '#0d9488' },
      { id: '/sitemap-graph', name: dict.Sitemap_Graph || 'Sitemap Graph', val: 10, color: isDark ? '#14b8a6' : '#0d9488' },
    ];

    const links = [
      // Home links
      { source: '/', target: '/identity' },
      { source: '/', target: '/website' },
      { source: '/', target: '/feedback' },
      
      // Profile links (branching from Home for structural visualization)
      { source: '/', target: '/portfolio' },
      { source: '/portfolio', target: '/all' },
      { source: '/portfolio', target: '/social' },
      { source: '/portfolio', target: '/certificate' },
      { source: '/portfolio', target: '/news' },

      // Experience links
      { source: '/', target: '/work' },
      { source: '/work', target: '/project' },
      { source: '/work', target: '/organization' },
      { source: '/work', target: '/award' },
      { source: '/work', target: '/hire-me' },

      // Artwork links
      { source: '/', target: '/music' },
      { source: '/music', target: '/literature' },

      // Other links
      { source: '/', target: '/college' },
      { source: '/', target: '/sitemap-graph' },
      { source: '/sitemap-graph', target: '/' } // Redirect cycle back to home
    ];

    return { nodes, links };
  }, [dict, isDark]);

  if (!mounted) return null;

  const displayNode = lockedNode || hoveredNode;

  return (
    <div className="w-full h-full flex flex-col md:flex-row bg-theme-surface">
      <div ref={containerRef} className="w-full md:w-[65%] h-[400px] md:h-full cursor-move relative border-b md:border-b-0 md:border-r border-theme-border flex items-center justify-center overflow-hidden">
        {/* Accessibility support for screen readers */}
        <ul className="sr-only">
          {graphData.nodes.map(node => (
            <li key={node.id}>
              <a href={`/${lang}${node.id === '/' ? '' : node.id}`}>{node.name}</a>
            </li>
          ))}
        </ul>

        <ForceGraph2D
          ref={graphRef as never}
          cooldownTicks={isMobile ? 50 : 150}
          onEngineStop={() => {
            if (!initialCenterDone.current && graphRef.current) {
              graphRef.current.zoomToFit(400, 40);
              initialCenterDone.current = true;
            }
          }}
          width={dimensions.width}
          height={dimensions.height}
          graphData={graphData}
          nodeLabel="name"
          nodeColor={(node) => (node as GraphNode).color}
          nodeRelSize={6}
          linkColor={() => isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}
          linkWidth={1.5}
          linkDirectionalArrowLength={3.5}
          linkDirectionalArrowRelPos={1}
          onNodeHover={(node) => {
            setHoveredNode(node as GraphNode | null);
            if (containerRef.current) {
              containerRef.current.style.cursor = node ? 'pointer' : 'move';
            }
          }}
          onNodeClick={(node) => {
            const gNode = node as GraphNode;
            // Toggle lock on click
            setLockedNode(prev => prev?.id === gNode.id ? null : gNode);
            
            if (gNode.x !== undefined && gNode.y !== undefined && graphRef.current) {
              // Center on node and zoom in slightly
              graphRef.current.centerAt(gNode.x, gNode.y, 1000);
              graphRef.current.zoom(1.5, 2000);
            }
          }}
          // onBackgroundClick={() => {
          //   setLockedNode(null);
          // }}
          nodeCanvasObject={(node, ctx, globalScale) => {
            const gNode = node as GraphNode;
            if (gNode.x === undefined || gNode.y === undefined) return;
            const label = gNode.name;
            const fontSize = 12 / globalScale;
            ctx.font = `${fontSize}px Sans-Serif`;
            const textWidth = ctx.measureText(label).width;
            const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2);

            // Draw node circle
            ctx.beginPath();
            ctx.arc(gNode.x, gNode.y, gNode.val / 2, 0, 2 * Math.PI, false);
            ctx.fillStyle = gNode.color;
            ctx.fill();
            
            // Draw text background
            ctx.fillStyle = isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)';
            ctx.fillRect(gNode.x - bckgDimensions[0] / 2, gNode.y + gNode.val / 2 + 2, bckgDimensions[0], bckgDimensions[1]);

            // Draw text
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = isDark ? '#ffffff' : '#000000';
            ctx.fillText(label, gNode.x, gNode.y + gNode.val / 2 + 2 + bckgDimensions[1] / 2);
          }}
        />
      </div>

      <div className="w-full md:w-[35%] h-[300px] md:h-full bg-theme-surface-strong relative overflow-hidden flex flex-col">
        {/* Preview Panel Header */}
        <div className="p-3 bg-theme-base border-b border-theme-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 z-10 shadow-sm relative">
          <span className="font-bold text-sm text-foreground flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: displayNode ? displayNode.color : (isDark ? '#555' : '#ccc') }}></span>
            {displayNode ? displayNode.name : (dict.Preview || 'Preview')}
            {lockedNode && (
              <button 
                onClick={() => setLockedNode(null)}
                className="ml-2 text-[10px] bg-theme-500 hover:bg-theme-600 text-white px-2 py-0.5 rounded capitalize tracking-wider flex items-center gap-1 cursor-pointer pointer-events-auto transition-colors"
                title="Unlock preview"
              >
                {dict.Locked || 'Locked'} <span>×</span>
              </button>
            )}
          </span>
          <span className="text-[10px] sm:text-xs text-theme-muted font-mono bg-theme-surface px-2 py-1 rounded border border-theme-border truncate max-w-full">
            {displayNode ? `/${lang}${displayNode.id === '/' ? '' : displayNode.id}` : (dict.Sitemap_Hover_Node || 'Hover over a node')}
          </span>
        </div>

        {/* Live Preview Iframe */}
        <div className="flex-1 relative bg-theme-base w-full h-full overflow-hidden">
          {displayNode ? (
            isMobile ? (
              <div className="w-full h-full flex flex-col items-center justify-center text-theme-muted text-sm font-medium p-6 text-center gap-6 bg-theme-surface-strong">
                <div className="w-16 h-16 rounded-full bg-theme-border/50 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                </div>
                <div className="space-y-2">
                  <p className="font-bold text-foreground">{displayNode.name}</p>
                  <p className="text-xs">{dict.Preview_Not_Available_Mobile || 'Preview is hidden on mobile to save battery and performance.'}</p>
                </div>
                <a 
                  href={`/${lang}${displayNode.id === '/' ? '' : displayNode.id}`} 
                  className="px-6 py-2.5 bg-theme-500 hover:bg-theme-600 text-white rounded-xl font-bold transition-colors shadow-sm"
                >
                  {dict.Visit || 'Visit Page'}
                </a>
              </div>
            ) : (
             <iframe 
               key={displayNode.id}
               src={`/${lang}${displayNode.id === '/' ? '' : displayNode.id}`}
               className={`w-[125%] h-[125%] border-0 absolute top-0 left-0 bg-theme-base origin-top-left transition-opacity duration-300 ${lockedNode ? 'pointer-events-auto' : 'pointer-events-none'}`}
               style={{ transform: 'scale(0.8)' }}
               title={`Preview of ${displayNode.name}`}
               loading="lazy"
             />
            )
          ) : (
             <div className="w-full h-full flex flex-col items-center justify-center text-theme-muted text-sm font-medium p-6 text-center gap-4 bg-theme-surface-strong">
               <div className="w-16 h-16 rounded-full bg-theme-border/50 flex items-center justify-center animate-pulse">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
               </div>
               <span>{dict.Sitemap_Preview_Instruction || 'Hover over any node on the graph to see a live preview of that page.'}</span>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
