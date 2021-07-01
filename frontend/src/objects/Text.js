import { useEffect, useMemo, useState } from 'react';
import { Canvas } from 'react-three-fiber';
import * as THREE from 'three';

const Text = ({ text, position, scale = [2, 2, 2], color = 'black', fontSize = 40 }) => {
    
    const canvas = useMemo(() => {

        var fontface = 'Arial'
        var fontsize = fontSize
        var borderThickness = 4

        var canvas = document.createElement('canvas')
        var context = canvas.getContext('2d')
        context.textBaseline = 'middle'
        context.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, avenir next, avenir, helvetica neue, helvetica, ubuntu, roboto, noto, segoe ui, arial, sans-serif`

        var metrics = context.measureText(text)
        var textWidth = metrics.width

        context.lineWidth = borderThickness

        context.fillText(text, textWidth - textWidth * 0.8, fontsize)
        return canvas
    }, [text]);

    return (
        <mesh position={position}>
            <planeGeometry attach="geometry" args={[2, 1]} />
            <meshStandardMaterial transparent alphaTest={0.5}>
                <canvasTexture attach="map" image={canvas} />
            </meshStandardMaterial>
        </mesh>
    )
}

export default Text;
