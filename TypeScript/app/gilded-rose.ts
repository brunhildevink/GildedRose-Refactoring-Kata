import { BackstagePasses, LegendaryItems } from "./types";
import { MAX_QUALITY, MIN_QUALITY, BACKSTAGE_PASS_QUALITY_INCREMENT_HIGH, BACKSTAGE_PASS_QUALITY_INCREMENT_MEDIUM, BACKSTAGE_PASS_QUALITY_INCREMENT_LOW, SELLIN_THRESHOLD, QUALITY_DECREMENT_NORMAL, QUALITY_DECREMENT_EXPIRED} from "./constants";

export class Item {
  name: string;
  sellIn: number;
  quality: number;

  constructor(name: string, sellIn: number, quality: number) {
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }
}

export class GildedRose {
  items: Array<Item>;

  constructor(items = [] as Array<Item>) {
    this.items = items;
  }

  updateQuality() {
    this.items.forEach(item => {
      const isBackstagePass = Object.values(BackstagePasses).includes(item.name as BackstagePasses);
      const isLegendaryItem = Object.values(LegendaryItems).includes(item.name as LegendaryItems);

      if (isBackstagePass) {
        this.updateBackstagePassQuality(item);
      } else if (!isLegendaryItem) {
        this.updateNormalItemQuality(item);
      }

      if (!isLegendaryItem) {
        item.sellIn -= 1;
      }
    });

    return this.items;
  }

  private updateBackstagePassQuality(item: Item) {
    const qualityIncrement =
      item.sellIn > 10
        ? BACKSTAGE_PASS_QUALITY_INCREMENT_HIGH
        : item.sellIn > 5
        ? BACKSTAGE_PASS_QUALITY_INCREMENT_MEDIUM
        : item.sellIn > SELLIN_THRESHOLD
        ? BACKSTAGE_PASS_QUALITY_INCREMENT_LOW
        : 0;

    if (item.sellIn <= SELLIN_THRESHOLD) {
      item.quality = MIN_QUALITY;
    } else {
      item.quality = Math.min(MAX_QUALITY, item.quality + qualityIncrement); // if quality is already at max, it will not be increased
    }
  }

  private updateNormalItemQuality(item: Item) {
    const isConjuredItem = item.name.includes('Conjured');
    const qualityDecrement = isConjuredItem ? QUALITY_DECREMENT_EXPIRED : item.sellIn > SELLIN_THRESHOLD ? QUALITY_DECREMENT_NORMAL : QUALITY_DECREMENT_EXPIRED;
    item.quality = Math.max(MIN_QUALITY, item.quality - qualityDecrement); // if quality is already at min, it will not be decreased
  }
}
