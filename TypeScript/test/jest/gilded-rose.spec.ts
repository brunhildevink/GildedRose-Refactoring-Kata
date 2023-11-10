import { Item, GildedRose } from '@/gilded-rose';

describe('Gilded Rose', () => {
  it('should have correct values', () => {
    const { items } = new GildedRose([new Item('foo', 21, 29)]);
    expect(items[0].name).toBe('foo');
    expect(items[0].sellIn).toBe(21);
    expect(items[0].quality).toBe(29);
  })

  it('should update correct sellIn value', () => {
    const gildedRose = new GildedRose([new Item('foo', 10, 10)]);
    expect(gildedRose.items[0].sellIn).toBe(10);
    gildedRose.updateQuality();
    expect(gildedRose.items[0].sellIn).toBe(9);
  });

  it('should update correct value property', () => {
    const gildedRose = new GildedRose([new Item('foo', 10, 10)]);
    expect(gildedRose.items[0].quality).toBe(10);
    gildedRose.updateQuality();
    expect(gildedRose.items[0].quality).toBe(9);
  });

  it('should decrease quality by 1 after updateQuality method ran once', () => {
    const gildedRose = new GildedRose([new Item('foo', 10, 10)]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(9);
  });

  it('should decrease quality twice as fast if sellIn has passed', () => {
    const gildedRose = new GildedRose([new Item('foo', 0, 10)]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(8);
  });

  it('should never have negative quality', () => {
    const gildedRose = new GildedRose([new Item('foo', 0, 0)]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(0);
  });

  it('should increase quality of Aged Brie', () => {
    const gildedRose = new GildedRose([new Item('Aged Brie', 10, 10)]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(11);
  });

  it('should never have quality higher than 50', () => {
    const gildedRose = new GildedRose([new Item('Aged Brie', 10, 50)]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(50);
  });

  it('should never change quality of Sulfuras', () => {
    const gildedRose = new GildedRose([new Item('Sulfuras, Hand of Ragnaros', 10, 80)]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(80);
  });

  it('should increase quality of Backstage passes by 2 when sellIn is 10 or less', () => {
    const gildedRose = new GildedRose([new Item('Backstage passes to a TAFKAL80ETC concert', 10, 10)]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(12);
  });

  it('should increase quality of Backstage passes by 3 when sellIn is 5 or less', () => {
    const gildedRose = new GildedRose([new Item('Backstage passes to a TAFKAL80ETC concert', 5, 10)]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(13);
  });

  it('should drop quality of Backstage passes to 0 when sellIn is 0 or less', () => {
    const gildedRose = new GildedRose([new Item('Backstage passes to a TAFKAL80ETC concert', 0, 10)]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(0);
  });
});
