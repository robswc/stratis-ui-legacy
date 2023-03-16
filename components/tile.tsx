// Includes a title and holds children
import React from "react";

export default function Tile({title, children, className}: { title: string, children: React.ReactNode, className?: string }) {
  return (
    <div className={`tile ${className}`}>
      <h1>{title}</h1>
      {children}
    </div>
  )
}
