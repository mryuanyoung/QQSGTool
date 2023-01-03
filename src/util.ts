import { Goods, GoodsMap, StepTreeNode } from "./goods";
import { Levels } from "./const";
import { CompoundResult, FormatGoods, FormatResult } from "./goods";

export function displayResult(goods: Goods, count: number, result: CompoundResult, goodsMap: GoodsMap): FormatResult {
  const allGoods = result.totalGoods;
  const keys = Object.keys(allGoods);
  const levelAGoods: FormatGoods[] = [], levelBGoods: FormatGoods[] = [];
  keys.forEach(key => {
    const goodsCount = allGoods[Number(key)];
    if (goodsCount.item.level === Levels.A) {
      levelAGoods.push({ name: goodsCount.item.fullName, count: formatText(goodsCount.count) })
    }
    else {
      levelBGoods.push({ name: goodsCount.item.fullName, count: formatText(goodsCount.count) })
    }
  })

  let interest = 0;
  const obtainGoods: FormatGoods[] = [];

  if (goods.compound!.luckyCompound) {
    const { probability, outcomeGoods, count: outcomeLuckyCount } = goods.compound!.luckyCompound;
    const totalLucky = count * probability;
    obtainGoods.push({ name: goods.fullName, count: formatText(count - totalLucky) });
    obtainGoods.push({ name: goodsMap[outcomeGoods].fullName, count: formatText(totalLucky * outcomeLuckyCount) });
    interest = goods.marketPrice * (count - totalLucky) + goodsMap[outcomeGoods].marketPrice * (totalLucky * outcomeLuckyCount) - result.grossExpense;
  }
  else {
    obtainGoods.push({ name: goods.fullName, count: formatText(count) });
    interest = goods.marketPrice * count - result.grossExpense;
  }

  return {
    stepTree: result.grossGoods,
    expense: {
      grossExpense: formatText(result.grossExpense),
      levelAGoods,
      levelBGoods
    },
    obtain: {
      goods: obtainGoods,
      interest: formatText(interest)
    }
  }
}

export function formatText(number: number): string {
  if (Math.abs(number) >= 1e8) {
    return number / 1e8 + 'e';
  }
  else if (Math.abs(number) >= 1e4) {
    return number / 1e4 + 'w';
  }
  else {
    return number.toString();
  }
}