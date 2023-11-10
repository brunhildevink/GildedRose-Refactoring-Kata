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
      } else {
        this.updateNormalItemQuality(item);
      }

      if (!isLegendaryItem) {
        item.sellIn -= 1;
      }
    });

    return this.items;
  }

  private updateBackstagePassQuality(item: Item) {
    let qualityIncrement =
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
      while (item.quality < MAX_QUALITY && qualityIncrement > 0 && item.sellIn) {
        item.quality += 1;
        qualityIncrement -= 1;
      }
    }
  }

  private updateNormalItemQuality(item: Item) {
    let qualityDecrement = item.sellIn > SELLIN_THRESHOLD ? QUALITY_DECREMENT_NORMAL : QUALITY_DECREMENT_EXPIRED;

    while (item.quality > MIN_QUALITY && item.quality < MAX_QUALITY && qualityDecrement > 0) {
      item.quality -= 1;
      qualityDecrement -= 1;
    }
  }
}
