import { BackstagePasses, ConjuredItems, LegendaryItems } from "./types";
import { MAX_QUALITY, MIN_QUALITY, BACKSTAGE_PASS_QUALITY_INCREMENT_HIGH, BACKSTAGE_PASS_QUALITY_INCREMENT_MEDIUM, BACKSTAGE_PASS_QUALITY_INCREMENT_LOW, SELLIN_THRESHOLD, QUALITY_DECREMENT_NORMAL, QUALITY_DECREMENT_EXPIRED, SELLIN_DECREMENT } from "./constants";

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
      const isLegendaryItem = Object.values(LegendaryItems).includes(item.name as LegendaryItems);

      if (!isLegendaryItem) {
        const isBackstagePass = Object.values(BackstagePasses).includes(item.name as BackstagePasses);

        if (isBackstagePass) {
          this.updateBackstagePassQuality(item);
        } else {
          this.updateNormalItemQuality(item);
        }

        item.sellIn -= SELLIN_DECREMENT;
      }
    });

    return this.items;
  }

  private updateBackstagePassQuality(item: Item) {
    let qualityIncrement = 0;

    switch (true) {
      case item.sellIn > 10:
        qualityIncrement = BACKSTAGE_PASS_QUALITY_INCREMENT_LOW;
        break;
      case item.sellIn > 5:
        qualityIncrement = BACKSTAGE_PASS_QUALITY_INCREMENT_MEDIUM;
        break;
      case item.sellIn > SELLIN_THRESHOLD:
        qualityIncrement = BACKSTAGE_PASS_QUALITY_INCREMENT_HIGH;
        break;
      default:
        qualityIncrement = 0;
    }

    if (item.sellIn <= SELLIN_THRESHOLD) {
      item.quality = MIN_QUALITY;
    } else {
      item.quality = Math.min(MAX_QUALITY, item.quality + qualityIncrement); // if quality is already at max, it will not be increased
    }
  }

  private updateNormalItemQuality(item: Item) {
    const isConjuredItem = Object.values(ConjuredItems).includes(item.name as ConjuredItems);
    const qualityDecrement = isConjuredItem ? QUALITY_DECREMENT_EXPIRED : item.sellIn > SELLIN_THRESHOLD ? QUALITY_DECREMENT_NORMAL : QUALITY_DECREMENT_EXPIRED;
    item.quality = Math.max(MIN_QUALITY, item.quality - qualityDecrement); // if quality is already at min, it will not be decreased
  }
}
