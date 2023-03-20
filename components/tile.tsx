// Includes a title and holds children
import React from "react";
import {IoSettings} from "react-icons/all";

export function TileSection({title, children, className}: { title: string, children: React.ReactNode, className?: string }) {
    return <div className='tile-section'>
        <h2 className='mb-2'>{title}</h2>
        <>
            {children}
        </>
    </div>
}
export default function Tile({title, children, className}: { title: string, children: React.ReactNode, className?: string }) {
  return (
    <div className={`tile ${className}`}>
      <div className='tile-header card mb-3'>
          <h1>{title}</h1>
          <div className='!hover:text-primary text-accent'>
              <div className='btn px-2 btn-sm'>
                  <IoSettings />
              </div>
          </div>
      </div>
      <div>
          {children}
      </div>
    </div>
  )
}
