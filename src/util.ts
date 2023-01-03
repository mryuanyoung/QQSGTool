import { Levels } from "../out/const";
import { CompoundResult, FormatGoods, FormatResult } from "./goods";

export function displayResult(result: CompoundResult): FormatResult{
  const allGoods = result.totalGoods;
  const keys = Object.keys(allGoods);
  const levelAGoods: FormatGoods[] = [], levelBGoods: FormatGoods[] = [];
  keys.forEach(key => {
    const goodsCount = allGoods[Number(key)];
    if(goodsCount.item.level === Levels.A){
      levelAGoods.push({name: goodsCount.item.fullName, count: goodsCount.count})
    }
    else{
      levelBGoods.push({name: goodsCount.item.fullName, count: goodsCount.count})
    }
  })

  return {
    grossExpense: result.grossExpense,
    levelAGoods,
    levelBGoods
  }
}