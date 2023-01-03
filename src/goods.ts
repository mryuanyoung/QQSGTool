import { Levels } from "./const";
import { formatText } from "./util";

export class Goods {
  level?: string
  serialNumber: number = 0
  fullName: string = ''
  shortName: string = ''
  marketPrice: number = 0
  acquisitionPath: Acquisition[] = []
  bagLimitation: number = 9999
  warehouseLimitation: number = 9999
  compound?: Compound
  legionLevel?: number

  constructor(goods: Goods) {
    Object.assign(this, goods);
  }

  static execCompound(goods: Goods, count: number, goodsMap: GoodsMap): CompoundResult {
    if (!goods.compound) {
      throw Error('此物品不可合成');
    }

    let singleGrossExpense = 0;
    const totalGoods: { [key: number]: GoodsCount } = {};
    const children: StepTreeNode[] = [];

    goods.compound.path.forEach(({ goods, count: pathCount, diy }) => {
      const entity = goodsMap[goods], totalCount = count * pathCount;


      if (entity.level === Levels.B || entity.level === Levels.A) {
        if (totalGoods[entity.serialNumber]) {
          totalGoods[entity.serialNumber].count += totalCount;
        }
        else {
          totalGoods[entity.serialNumber] = { item: entity, count: totalCount };
        }
      }

      if (!diy || !entity.compound) {
        singleGrossExpense += entity.marketPrice * totalCount;
        children.push({
          serialNumber: entity.serialNumber,
          name: entity.fullName,
          count: formatText(totalCount),
        })
        return;
      }

      const compoundRes = Goods.execCompound(entity, totalCount, goodsMap);
      const partialTotalGoods = compoundRes.totalGoods;

      singleGrossExpense += compoundRes.grossExpense;
      children.push(compoundRes.grossGoods);
      const keys = Object.keys(partialTotalGoods);
      keys.forEach(key => {
        if (totalGoods[key]) {
          totalGoods[key].count += partialTotalGoods[key].count;
        }
        else {
          totalGoods[key] = partialTotalGoods[key];
        }
      })
    })

    return {
      grossExpense: singleGrossExpense,
      grossGoods: {
        serialNumber: goods.serialNumber,
        name: goods.fullName,
        count: formatText(count),
        children
      },
      totalGoods,
    }
  }
}

export interface GoodsMap {
  [key: number]: Goods
}

interface GoodsCount {
  item: Goods, count: number
}

export interface CompoundResult {
  grossGoods: StepTreeNode,
  totalGoods: { [key: number]: GoodsCount },
  grossExpense: number,
}

export interface FormatGoods { name: string, count: string }

export interface FormatResult {
  stepTree: StepTreeNode,
  expense: {
    grossExpense: string,
    levelBGoods: FormatGoods[],
    levelAGoods: FormatGoods[],
  },
  obtain: {
    goods: FormatGoods[];
    interest: string,
  }
}

export interface StepTreeNode {
  serialNumber: number,
  name: string,
  count: string,
  children?: StepTreeNode[]
}

interface Compound {
  profession: Profession,
  levelLimitation: number,
  path: {
    goods: number, // serialNumber
    count: number,
    diy: boolean,
  }[],
  expense: number,
  luckyCompound?: {
    probability: number,
    outcomeGoods: number, // serialNumber
    count: number,
  }
}

enum Acquisition {
  compound, // 0合成
  mall, // 1商城
  market, // 2市场交易
  gaming, // 3游戏产出
  luckyCompund // 4幸运合成
}

enum Profession {
  镶工,
  工匠,
  庖丁,
  玉石匠,
  制符师,
  普通合成
}

