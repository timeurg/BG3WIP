# Moving Basket Clothes in Batches

https://www.nexusmods.com/baldursgate3/mods/97 is an awesome mod that provides 828 items at the moment (29 Aug 2023).

AnteMaxx, the mod's author provides a way to alter stats and slots of his armor via CustomizeEquipmentStats file.

I'd like for all cloaks, boots, belts, gloves, hats and pauldrons to go to underwear slot. This is too much work for manual approach, plus it must be repeated every release.

So I just do:

```
cp 'E:\SteamLibrary\steamapps\common\Baldurs Gate 3\Data\Public\BasketEquipmentNSFW\Stats\Generated\Data\Armor.txt' test/Armor.txt

node bg3 db:find:test/Armor.txt using:_foot 

node bg3 mod:dataset:new Boots

node bg3 mod:dataset:Boots mutate toCampClothes --dump test/Boots.txt

node bg3 db:find:test/Armor.txt using:_hand

node bg3 mod:dataset:new Boots

node bg3 mod:dataset toCampClothes --dump test/Gloves.txt

node bg3 db:find:test/Armor.txt using:_Head

node bg3 mod:dataset toCampClothes --dump test/Head.txt

node bg3 db:find:test/Armor.txt using:'_Back|ARM_Cloak'

node bg3 mod:dataset toCampClothes --dump test/Back.txt

node bg3 mod:dedupe test/Armor.txt test/Boots.txt test/Gloves.txt test/Head.txt test/Back.txt --dump test/Armor.txt

```

Well actually I don't, I just hit 

```
node sequence.js ./private/basket.js

node bg3 mod:test
```

And enjoy loking fabulous ingame.