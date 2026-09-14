import React from 'react';
import { useWindowDimensions, View } from 'react-native';
import { decorItems, DecorSlot } from '../game/decor';
import { PixelDecor } from './PixelDecor';

const desktopPositions:Record<DecorSlot,object>={
  'floor-left':{left:38,bottom:78},
  'floor-center':{left:'43%',bottom:77},
  'floor-right':{right:132,bottom:78},
  'wall-left':{left:118,top:66},
  'wall-center':{left:'42%',top:58},
  'wall-right':{right:126,top:69},
  ceiling:{left:'44%',top:38},
  corner:{right:42,bottom:78},
};

const mobilePositions:Record<DecorSlot,object>={
  'floor-left':{left:16,bottom:78},
  'floor-center':{left:'38%',bottom:77},
  'floor-right':{right:70,bottom:78},
  'wall-left':{left:42,top:66},
  'wall-center':{left:'39%',top:58},
  'wall-right':{right:54,top:69},
  ceiling:{left:'40%',top:38},
  corner:{right:14,bottom:78},
};

const tinyPositions:Record<DecorSlot,object>={
  'floor-left':{left:8,bottom:78},
  'floor-center':{left:'36%',bottom:77},
  'floor-right':{right:42,bottom:78},
  'wall-left':{left:18,top:68},
  'wall-center':{left:'36%',top:58},
  'wall-right':{right:28,top:70},
  ceiling:{left:'37%',top:38},
  corner:{right:5,bottom:78},
};

const desktopScales:Record<DecorSlot,number>={
  'floor-left':.88,'floor-center':.9,'floor-right':.88,
  'wall-left':.78,'wall-center':.82,'wall-right':.78,
  ceiling:.83,corner:.84,
};

const mobileScales:Record<DecorSlot,number>={
  'floor-left':.72,'floor-center':.74,'floor-right':.72,
  'wall-left':.66,'wall-center':.69,'wall-right':.66,
  ceiling:.68,corner:.7,
};

const tinyScales:Record<DecorSlot,number>={
  'floor-left':.62,'floor-center':.65,'floor-right':.62,
  'wall-left':.57,'wall-center':.6,'wall-right':.57,
  ceiling:.59,corner:.61,
};

export function TankOfficeDecor({placed}:{placed:Partial<Record<DecorSlot,string>>}){
  const {width}=useWindowDimensions();
  const tiny=width<430;
  const mobile=width<700;
  const positions=tiny?tinyPositions:mobile?mobilePositions:desktopPositions;
  const scales=tiny?tinyScales:mobile?mobileScales:desktopScales;

  return <>{Object.entries(placed).map(([slot,id])=>{
    const typedSlot=slot as DecorSlot;
    if(!id||!decorItems.some(item=>item.id===id))return null;
    return <View pointerEvents="none" key={`${slot}-${id}`} style={[{position:'absolute',zIndex:9},positions[typedSlot]]}><PixelDecor id={id} animate scale={scales[typedSlot]}/></View>;
  })}</>;
}
