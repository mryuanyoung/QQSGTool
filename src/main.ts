import { Goods, GoodsMap } from "./goods";
import json from './goods.json';
import { displayResult } from "./util";


(function main(goods: number, count: number) {
  const entityMap: GoodsMap = {};
  initGoodsMap(entityMap);

  const target = entityMap[goods];

  if(target.compound){
    const res = target.execCompound(count, entityMap);
    console.log(displayResult(res));
  }
  else{
    console.log(`${target.fullName}: ${target.marketPrice}`)
  }

})(72, 100);


function initGoodsMap(entityMap: GoodsMap) {
  const keys = Object.keys(json);
  keys.forEach(key => {
    entityMap[Number(key)] = new Goods(json[key]);
  })
}