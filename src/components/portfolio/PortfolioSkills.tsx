"use client";

import React, { useState, useEffect } from 'react';
import { useSettings } from '../providers/SettingsContext';
import { Wrench, GripVertical, X } from 'lucide-react';
import { SkillCategory } from '@/lib/data';
import { Reorder, useDragControls } from 'framer-motion';

function DraggableSkillItem({ cat, idx, handleDeleteCategory, handleDeleteItem }: { cat: SkillCategory, idx: number, handleDeleteCategory: (idx: number) => void, handleDeleteItem: (catIdx: number, itemIdx: number, subIdx?: number) => void }) {
  const controls = useDragControls();
  
  return (
    <Reorder.Item
      value={cat}
      dragListener={false}
      dragControls={controls}
      className={`p-4 rounded-xl border border-theme-border bg-theme-surface/10 hover:border-theme-500/30 transition-all duration-300 relative group`}
    >
      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 z-10">
         <div 
           onPointerDown={(e) => controls.start(e)}
           className="cursor-grab active:cursor-grabbing flex items-center h-full px-1"
           aria-label="Drag to reorder category"
           role="button"
           tabIndex={0}
         >
           <GripVertical size={16} className="text-theme-muted hover:text-theme-500" />
         </div>
         <button 
           onClick={() => handleDeleteCategory(idx)} 
           className="text-theme-muted hover:text-red-500"
           aria-label={`Delete category ${cat.category}`}
         >
           <X size={16} />
         </button>
      </div>
      
      <h3 className="text-sm font-bold text-foreground mb-3 pr-12">
        {cat.category}
      </h3>
      
      {cat.subcategories ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cat.subcategories.map((sub, sIdx) => (
            <div key={sIdx}>
              <h4 className="text-[12px] font-bold text-theme-muted tracking-wider mb-1.5">{sub.title}</h4>
              <div className="flex flex-wrap gap-1.5">
                {sub.items.map((item, iIdx) => (
                  <div
                    key={`${item}-${iIdx}`}
                    className="flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-theme-surface-strong border border-theme-border text-[var(--text-muted)] hover:border-theme-500 hover:text-theme-500 transition-all duration-200 select-none cursor-default group/item"
                  >
                    <span>{item}</span>
                    <button 
                      onClick={() => handleDeleteItem(idx, iIdx, sIdx)} 
                      className="opacity-0 group-hover/item:opacity-100 hover:text-red-500 ml-1"
                      aria-label={`Delete skill ${item}`}
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {cat.items?.map((item, iIdx) => (
            <div
              key={`${item}-${iIdx}`}
              className="flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-theme-surface-strong border border-theme-border text-[var(--text-muted)] hover:border-theme-500 hover:text-theme-500 transition-all duration-200 select-none cursor-default group/item"
            >
              <span>{item}</span>
              <button 
                onClick={() => handleDeleteItem(idx, iIdx)} 
                className="opacity-0 group-hover/item:opacity-100 hover:text-red-500 ml-1"
                aria-label={`Delete skill ${item}`}
              >
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      )}
    </Reorder.Item>
  );
}

interface PortfolioSkillsProps {
  skills: SkillCategory[];
  title: string;
}

export default function PortfolioSkills({ skills: initialSkills, title }: PortfolioSkillsProps) {
  const { isAtsMode } = useSettings();
  const [skills, setSkills] = useState<SkillCategory[]>(initialSkills);

  // Sync with props if they change
  useEffect(() => {
    setSkills(initialSkills);
  }, [initialSkills]);

  const handleDeleteItem = (catIdx: number, itemIdx: number, subIdx?: number) => {
    const newSkills = [...skills];
    if (subIdx !== undefined && newSkills[catIdx].subcategories) {
      newSkills[catIdx].subcategories![subIdx].items.splice(itemIdx, 1);
    } else if (newSkills[catIdx].items) {
      newSkills[catIdx].items!.splice(itemIdx, 1);
    }
    setSkills(newSkills);
  };

  const handleDeleteCategory = (catIdx: number) => {
    const newSkills = [...skills];
    newSkills.splice(catIdx, 1);
    setSkills(newSkills);
  };

  if (isAtsMode) {
    return (
      <section className="mt-4 border-b border-theme-border pb-2 w-full portfolio-skills-section-ats">
        <div className="flex items-center gap-2 border-b border-theme-border/50 pb-0.5 mb-1.5">
          <h2 className="text-lg font-black nav-active-gacor tracking-wider text-theme-muted">
            {title}
          </h2>
        </div>
        <div className="flex flex-col gap-2 text-xs text-[var(--text-muted)] mt-1.5">
          {skills.map((cat, idx) => (
            <div key={cat.category} className="leading-relaxed">
              <div className="font-bold text-foreground">{cat.category}:</div>
              {cat.subcategories ? (
                <div className="pl-4 flex flex-col gap-0.5">
                  {cat.subcategories.map((sub, sIdx) => (
                    <div key={sIdx}>• {sub.title}: {sub.items.join(', ')}</div>
                  ))}
                </div>
              ) : (
                <div className="pl-4">• {cat.items?.join(', ')}</div>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4 portfolio-skills-section mt-8">
      <div className="flex items-center gap-2 border-b border-theme-border/50 pb-1">
        <Wrench size={14} className="text-theme-500 shrink-0" />
        <h2 className="text-lg font-black nav-active-gacor tracking-wider text-theme-muted">
          {title}
        </h2>
      </div>
      <Reorder.Group 
        axis="y" 
        values={skills} 
        onReorder={setSkills} 
        className="grid grid-cols-1 gap-4"
      >
        {skills.map((cat, idx) => (
          <DraggableSkillItem
            key={cat.category}
            cat={cat}
            idx={idx}
            handleDeleteCategory={handleDeleteCategory}
            handleDeleteItem={handleDeleteItem}
          />
        ))}
      </Reorder.Group>
    </section>
  );
}
