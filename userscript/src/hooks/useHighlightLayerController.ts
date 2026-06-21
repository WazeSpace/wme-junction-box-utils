import { useRef, useEffect, useCallback } from 'react';

export function useHighlightLayerController(layer: any) {
  const originalStylesRef = useRef<{ zIndex: string; pointerEvents: string } | null>(null);

  const restore = useCallback(() => {
    if (!layer || !originalStylesRef.current) return;
    const layerDiv = layer.div || document.getElementById(layer.id);
    if (layerDiv) {
      layerDiv.style.zIndex = originalStylesRef.current.zIndex;
      layerDiv.style.pointerEvents = originalStylesRef.current.pointerEvents;
    }
    originalStylesRef.current = null;
  }, [layer]);

  const elevate = useCallback(() => {
    if (!layer) return;
    const layerDiv = layer.div || document.getElementById(layer.id);
    if (layerDiv) {
      if (!originalStylesRef.current) {
        originalStylesRef.current = {
          zIndex: layerDiv.style.zIndex || '',
          pointerEvents: layerDiv.style.pointerEvents || '',
        };
      }
      layerDiv.style.zIndex = '9999';
      layerDiv.style.pointerEvents = 'none';
    }
  }, [layer]);

  useEffect(() => {
    return () => {
      restore();
    };
  }, [restore]);

  return { elevate, restore };
}
