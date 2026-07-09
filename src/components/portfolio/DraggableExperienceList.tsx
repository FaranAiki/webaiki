"use client";

import React from 'react';
import { Reorder, useDragControls } from 'framer-motion';
import { GripVertical } from 'lucide-react';
import PortfolioSummaryItem from './PortfolioSummaryItem';
import { useSettings } from '../providers/SettingsContext';

interface Job {
  title: string;
  company: string;
  date: string;
  description: string | string[];
  url?: string;
}

interface DraggableExperienceListProps {
  items: Job[];
  onReorder: (newOrder: Job[]) => void;
  onRemove: (job: Job) => void;
  ariaLabelTemplate?: string;
  category: string;
}



function DraggableItem({ job, onRemove, ariaLabelTemplate }: { job: Job, onRemove: () => void, ariaLabelTemplate?: string }) {
  const controls = useDragControls();

  return (
    <Reorder.Item 
      value={job}
      dragListener={false}
      dragControls={controls}
      className="relative group"
    >
      <div 
        onPointerDown={(e) => controls.start(e)}
        className="absolute right-8 top-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center cursor-grab active:cursor-grabbing z-10"
        aria-label={`Drag to reorder ${job.title}`}
        role="button"
        tabIndex={0}
      >
        <GripVertical size={16} className="text-theme-muted hover:text-theme-500" />
      </div>
      <PortfolioSummaryItem
        title={job.title}
        company={job.company}
        date={job.date}
        description={job.description}
        url={job.url}
        onRemove={onRemove}
        ariaLabelTemplate={ariaLabelTemplate}
      />
    </Reorder.Item>
  );
}

export default function DraggableExperienceList({ items, onReorder, onRemove, ariaLabelTemplate, category }: DraggableExperienceListProps) {
  return (
    <Reorder.Group axis="y" values={items} onReorder={onReorder} className="space-y-1">
      {items.map((job) => (
        <DraggableItem
          key={`${category}-${job.title}-${job.company}-${job.date}`}
          job={job}
          onRemove={() => onRemove(job)}
          ariaLabelTemplate={ariaLabelTemplate}
        />
      ))}
    </Reorder.Group>
  );
}
