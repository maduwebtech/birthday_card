'use client';

import React, { useEffect, useRef, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { fabric } from 'fabric';
import { Download, Trash2, RotateCcw, ZoomIn, ZoomOut, Move } from 'lucide-react';
import { CardTemplate, TextElement, ExportOptions, COLORS, FONTS } from '@/types';
import { cn, downloadDataUrl } from '@/lib/utils';

interface CanvasEditorProps {
  template: CardTemplate;
  wishText: string;
  recipientName: string;
  onCanvasReady?: (canvas: fabric.Canvas) => void;
  className?: string;
}

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;

export default function CanvasEditor({
  template,
  wishText,
  recipientName,
  onCanvasReady,
  className,
}: CanvasEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);
  const [showGrid, setShowGrid] = useState(false);

  // Initialize Fabric.js canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      backgroundColor: template.backgroundColor,
      preserveObjectStacking: true,
      selection: true,
      uniScaleTransform: false,
    });

    fabricCanvasRef.current = canvas;

    // Event listeners
    canvas.on('selection:created', (e) => {
      setSelectedObject(e.selected?.[0] || null);
    });

    canvas.on('selection:updated', (e) => {
      setSelectedObject(e.selected?.[0] || null);
    });

    canvas.on('selection:cleared', () => {
      setSelectedObject(null);
    });

    // Handle object modifications
    canvas.on('object:modified', () => {
      canvas.renderAll();
    });

    setIsReady(true);
    onCanvasReady?.(canvas);

    return () => {
      canvas.dispose();
      fabricCanvasRef.current = null;
    };
  }, [onCanvasReady]);

  // Apply template when it changes
  useEffect(() => {
    if (!fabricCanvasRef.current || !isReady) return;

    const canvas = fabricCanvasRef.current;
    
    // Clear canvas
    canvas.clear();
    
    // Set background
    if (template.gradient) {
      // For gradient backgrounds, we use a rect with gradient fill
      const gradientRect = new fabric.Rect({
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        left: 0,
        top: 0,
        selectable: false,
        evented: false,
      });
      
      // Parse gradient string to create fabric gradient
      const gradient = new fabric.Gradient({
        type: 'linear',
        coords: {
          x1: 0,
          y1: 0,
          x2: CANVAS_WIDTH,
          y2: CANVAS_HEIGHT,
        },
        colorStops: parseGradient(template.gradient),
      });
      
      gradientRect.set('fill', gradient);
      canvas.add(gradientRect);
      canvas.sendToBack(gradientRect);
    } else {
      canvas.setBackgroundColor(template.backgroundColor, () => {
        canvas.renderAll();
      });
    }

    // Add decorations
    template.decorations.forEach((decoration) => {
      const shape = createDecorationShape(decoration);
      if (shape) {
        canvas.add(shape);
        canvas.sendToBack(shape);
      }
    });

    canvas.renderAll();
  }, [template, isReady]);

  // Update text when wish or name changes
  useEffect(() => {
    if (!fabricCanvasRef.current || !isReady) return;

    const canvas = fabricCanvasRef.current;
    
    // Remove existing text objects
    const objects = canvas.getObjects();
    objects.forEach((obj) => {
      if (obj.type === 'text' || obj.type === 'textbox') {
        canvas.remove(obj);
      }
    });

    // Add title text (name)
    const titleText = new fabric.Textbox(`Happy Birthday, ${recipientName}!`, {
      left: CANVAS_WIDTH / 2,
      top: 60,
      width: CANVAS_WIDTH - 80,
      fontSize: 32,
      fontFamily: template.defaultFont,
      fill: template.defaultTextColor,
      textAlign: 'center',
      fontWeight: 'bold',
      originX: 'center',
      originY: 'center',
      selectable: true,
      hasControls: true,
      hasBorders: true,
      borderColor: '#ec4899',
      cornerColor: '#ec4899',
      cornerSize: 8,
      transparentCorners: false,
    });

    // Add wish text
    const wishTextbox = new fabric.Textbox(wishText, {
      left: CANVAS_WIDTH / 2,
      top: 200,
      width: CANVAS_WIDTH - 100,
      fontSize: 20,
      fontFamily: template.defaultFont,
      fill: template.defaultTextColor,
      textAlign: 'center',
      originX: 'center',
      originY: 'center',
      selectable: true,
      hasControls: true,
      hasBorders: true,
      borderColor: '#ec4899',
      cornerColor: '#ec4899',
      cornerSize: 8,
      transparentCorners: false,
      splitByGrapheme: false,
    });

    canvas.add(titleText);
    canvas.add(wishTextbox);
    canvas.renderAll();
  }, [wishText, recipientName, template, isReady]);

  // Helper function to parse gradient string
  function parseGradient(gradientStr: string): Array<{ offset: number; color: string; opacity: number }> {
    // Simple parser for linear-gradient strings
    const colors: Array<{ offset: number; color: string; opacity: number }> = [];
    
    // Extract hex colors from gradient string
    const hexMatches = gradientStr.match(/#[a-fA-F0-9]{6}/g);
    if (hexMatches) {
      hexMatches.forEach((color, index) => {
        colors.push({
          offset: index / (hexMatches.length - 1),
          color: color,
          opacity: 1,
        });
      });
    }
    
    return colors.length > 0 ? colors : [
      { offset: 0, color: template.backgroundColor, opacity: 1 },
      { offset: 1, color: template.backgroundColor, opacity: 1 },
    ];
  }

  // Create decoration shapes
  function createDecorationShape(decoration: any): fabric.Object | null {
    const { type, x, y, size, color, rotation = 0 } = decoration;

    switch (type) {
      case 'balloon':
        const balloon = new fabric.Circle({
          left: x,
          top: y,
          radius: size / 2,
          fill: color,
          selectable: false,
          evented: false,
          angle: rotation,
        });
        
        // Add balloon string
        const string = new fabric.Line([x, y + size / 2, x, y + size / 2 + 40], {
          stroke: '#666',
          strokeWidth: 1,
          selectable: false,
          evented: false,
        });
        
        return new fabric.Group([balloon, string], {
          left: x - size / 2,
          top: y - size / 2,
          selectable: false,
          evented: false,
          angle: rotation,
        });

      case 'star':
        return new fabric.Star({
          left: x,
          top: y,
          numPoints: 5,
          innerRadius: size / 3,
          outerRadius: size / 2,
          fill: color,
          selectable: false,
          evented: false,
          angle: rotation,
        });

      case 'heart':
        const heartPath = 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z';
        return new fabric.Path(heartPath, {
          left: x,
          top: y,
          fill: color,
          scaleX: size / 24,
          scaleY: size / 24,
          selectable: false,
          evented: false,
          angle: rotation,
        });

      case 'confetti':
        return new fabric.Rect({
          left: x,
          top: y,
          width: size,
          height: size,
          fill: color,
          selectable: false,
          evented: false,
          angle: Math.random() * 360,
        });

      case 'cake':
        // Simple cake representation using rectangles
        const base = new fabric.Rect({
          left: x - size / 2,
          top: y,
          width: size,
          height: size * 0.6,
          fill: '#f4a460',
          rx: 5,
          ry: 5,
        });
        const top = new fabric.Rect({
          left: x - size / 2 + 10,
          top: y - 15,
          width: size - 20,
          height: 20,
          fill: '#ff69b4',
          rx: 3,
          ry: 3,
        });
        const candle = new fabric.Rect({
          left: x - 3,
          top: y - 35,
          width: 6,
          height: 20,
          fill: '#fff',
        });
        const flame = new fabric.Circle({
          left: x - 5,
          top: y - 45,
          radius: 8,
          fill: '#ffa500',
        });
        
        return new fabric.Group([base, top, candle, flame], {
          left: x - size / 2,
          top: y - 45,
          selectable: false,
          evented: false,
        });

      case 'ribbon':
        return new fabric.Rect({
          left: x - size / 2,
          top: y,
          width: size,
          height: 8,
          fill: color,
          selectable: false,
          evented: false,
        });

      default:
        return null;
    }
  }

  // Export functions
  const exportImage = useCallback((format: 'png' | 'jpeg' = 'png', quality: number = 1) => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const dataUrl = canvas.toDataURL({
      format,
      quality,
      multiplier: 2, // High resolution
      left: 0,
      top: 0,
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
    });

    const filename = `birthday-card-${recipientName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.${format}`;
    downloadDataUrl(dataUrl, filename);
  }, [recipientName]);

  // Zoom controls
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.5));
  };

  const handleResetZoom = () => {
    setZoom(1);
  };

  // Delete selected object
  const handleDelete = () => {
    if (!fabricCanvasRef.current || !selectedObject) return;
    
    // Only allow deleting text objects, not decorations
    if (selectedObject.type === 'text' || selectedObject.type === 'textbox') {
      fabricCanvasRef.current.remove(selectedObject);
      fabricCanvasRef.current.renderAll();
      setSelectedObject(null);
    }
  };

  // Update text properties
  const updateTextProperty = (property: string, value: string | number) => {
    if (!fabricCanvasRef.current || !selectedObject) return;
    
    if (selectedObject.type === 'text' || selectedObject.type === 'textbox') {
      selectedObject.set(property, value);
      fabricCanvasRef.current.renderAll();
    }
  };

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Toolbar */}
      <div className="flex items-center justify-between bg-white rounded-xl p-3 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Canvas:</span>
          <div className="flex items-center gap-1">
            <button
              onClick={handleZoomOut}
              className="tool-btn"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-600 w-12 text-center">{Math.round(zoom * 100)}%</span>
            <button
              onClick={handleZoomIn}
              className="tool-btn"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetZoom}
              className="tool-btn"
              title="Reset Zoom"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {selectedObject && (selectedObject.type === 'text' || selectedObject.type === 'textbox') && (
            <>
              <select
                className="text-sm border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
                onChange={(e) => updateTextProperty('fontFamily', e.target.value)}
                value={(selectedObject as fabric.Text).fontFamily}
              >
                {FONTS.map((font) => (
                  <option key={font.value} value={font.value}>
                    {font.name}
                  </option>
                ))}
              </select>
              
              <div className="flex items-center gap-1">
                {COLORS.slice(0, 8).map((color) => (
                  <button
                    key={color}
                    onClick={() => updateTextProperty('fill', color)}
                    className="w-6 h-6 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>

              <button
                onClick={handleDelete}
                className="tool-btn text-red-600 hover:text-red-700 hover:bg-red-50"
                title="Delete Selected"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportImage('png')}
            className="btn-secondary text-sm"
          >
            <Download className="w-4 h-4 mr-1" />
            PNG
          </button>
          <button
            onClick={() => exportImage('jpeg')}
            className="btn-secondary text-sm"
          >
            <Download className="w-4 h-4 mr-1" />
            JPEG
          </button>
        </div>
      </div>

      {/* Canvas Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="canvas-container relative"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: 'center center',
        }}
      >
        <canvas
          ref={canvasRef}
          className="rounded-xl shadow-lg"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
        
        {/* Overlay hint */}
        <div className="absolute top-4 left-4 bg-black/50 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm">
          <Move className="w-3 h-3 inline mr-1" />
          Click text to edit • Drag to move
        </div>
      </motion.div>

      {/* Instructions */}
      <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-800">
        <p className="font-medium mb-1">How to customize your card:</p>
        <ul className="list-disc list-inside space-y-1 text-blue-700">
          <li>Click on any text to select it</li>
          <li>Double-click text to edit content directly</li>
          <li>Drag text to reposition</li>
          <li>Use corner handles to resize</li>
          <li>Use the toolbar to change fonts and colors</li>
        </ul>
      </div>
    </div>
  );
}

// Extend fabric to include Star
(fabric as any).Star = fabric.util.createClass(fabric.Object, {
  type: 'star',
  initialize: function(options: any) {
    this.callSuper('initialize', options);
    this.numPoints = options.numPoints || 5;
    this.innerRadius = options.innerRadius || 10;
    this.outerRadius = options.outerRadius || 20;
  },
  _render: function(ctx: CanvasRenderingContext2D) {
    const numPoints = this.numPoints;
    const innerRadius = this.innerRadius;
    const outerRadius = this.outerRadius;
    
    ctx.beginPath();
    for (let i = 0; i < numPoints * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (Math.PI * i) / numPoints - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  },
});
