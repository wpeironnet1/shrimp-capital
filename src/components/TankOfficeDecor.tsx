import React from 'react';
import { View } from 'react-native';
import { decorItems, DecorSlot } from '../game/decor';
import { PixelDecor } from './PixelDecor';

const positions:Record<DecorSlot,object>={
  'floor-left':{left:38,bottom:78},
  'floor-center':{left:'43%',bottom:77},
  'floor-right':{right:132,bottom:78},
  'wall-left':{left:118,top:66},
  'wall-center':{left:'42%',top:58},
  'wall-right':{right:126,top:69},
  ceiling:{left:'44%',top:38},
  corner:{right:42,bottom:78},
};

const scales:Record<DecorSlot,number>={
  'floor-left':.88,'floor-center':.9,'floor-right':.88,
  'wall-left':.78,'wall-center':.82,'wall-right':.78,
  ceiling:.83,corner:.84,
};

export function TankOfficeDecor({placed}:{placed:Partial<Record<DecorSlot,string>>}){
  return <>{Object.entries(placed).map(([slot,id])=>{
    const typedSlot=slot as DecorSlot;
    if(!id||!decorItems.some(item=>item.id===id))return null;
    return <View pointerEvents="none" key={`${slot}-${id}`} style={[{position:'absolute',zIndex:9},positions[typedSlot]]}><PixelDecor id={id} animate scale={scales[typedSlot]}/></View>;
  })}</>;
}
