import React from 'react';
import { View } from 'react-native';
import { PixelDecor } from './PixelDecor';

export function DecorThumbnail({id}:{id:string}){
  return <View style={{width:92,height:72,alignItems:'center',justifyContent:'center'}}><PixelDecor id={id} scale={.82}/></View>;
}
