import { Goods, GoodsMap } from "./goods";
import json from './goods.json';
import { displayResult } from "./util";


(function main(goods: number, count: number) {
  const entityMap: GoodsMap = {};
  initGoodsMap(entityMap);

  const target = entityMap[goods];

  if(target.compound){
    const res = Goods.execCompound(target, count, entityMap);
    console.log(JSON.stringify(displayResult(target, count, res, entityMap)));
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