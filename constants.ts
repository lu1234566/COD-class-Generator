
import { CoDGame, GameSystem } from './types';

export const SUPPORTED_GAMES: CoDGame[] = [
  { 
    id: 'cod4', 
    name: 'Call of Duty 4: Modern Warfare', 
    year: 2007, 
    system: GameSystem.CLASSIC_3_PERK, 
    image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/7940/library_600x900.jpg' 
  },
  { id: 'waw', name: 'Call of Duty: World at War', year: 2008, system: GameSystem.CLASSIC_3_PERK, image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/10090/library_600x900.jpg' },
  { id: 'mw2_2009', name: 'Call of Duty: Modern Warfare 2 (2009)', year: 2009, system: GameSystem.CLASSIC_3_PERK, image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/10180/library_600x900.jpg' },
  { id: 'bo1', name: 'Call of Duty: Black Ops', year: 2010, system: GameSystem.CLASSIC_3_PERK, image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/42700/library_600x900.jpg' },
  { id: 'mw3', name: 'Call of Duty: Modern Warfare 3', year: 2011, system: GameSystem.CLASSIC_3_PERK, image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/42680/library_600x900.jpg' },
  { id: 'bo2', name: 'Call of Duty: Black Ops II', year: 2012, system: GameSystem.PICK_10, image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/202970/library_600x900.jpg' },
  { id: 'ghosts', name: 'Call of Duty: Ghosts', year: 2013, system: GameSystem.GHOSTS_POINTS, image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/209160/library_600x900.jpg' },
  { id: 'aw', name: 'Call of Duty: Advanced Warfare', year: 2014, system: GameSystem.PICK_13, image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/209650/library_600x900.jpg' },
  { id: 'bo3', name: 'Call of Duty: Black Ops III', year: 2015, system: GameSystem.PICK_10, image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/311210/library_600x900.jpg' },
  { id: 'iw', name: 'Call of Duty: Infinite Warfare', year: 2016, system: GameSystem.PICK_10, image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/292730/library_600x900.jpg' },
  { id: 'ww2', name: 'Call of Duty: WWII', year: 2017, system: GameSystem.CLASSIC_3_PERK, image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/476600/library_600x900.jpg' },
  { id: 'bo4', name: 'Call of Duty: Black Ops 4', year: 2018, system: GameSystem.PICK_10, image: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1v9l.jpg' },
  { id: 'mw2019', name: 'Call of Duty: Modern Warfare (2019)', year: 2019, system: GameSystem.GUNSMITH_5, image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1938090/library_600x900.jpg' },
  { id: 'bocw', name: 'Call of Duty: Black Ops Cold War', year: 2020, system: GameSystem.GUNSMITH_5, image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1985810/library_600x900.jpg' },
  { id: 'vanguard', name: 'Call of Duty: Vanguard', year: 2021, system: GameSystem.GUNSMITH_5, image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1985820/library_600x900.jpg' },
  { id: 'mw2_2022', name: 'Call of Duty: Modern Warfare II (2022)', year: 2022, system: GameSystem.GUNSMITH_5, image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1962660/library_600x900.jpg' },
  { id: 'mw3_2023', name: 'Call of Duty: Modern Warfare III (2023)', year: 2023, system: GameSystem.GEAR_SYSTEM, image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2519060/library_600x900.jpg' },
  { id: 'bo6', name: 'Call of Duty: Black Ops 6', year: 2024, system: GameSystem.GEAR_SYSTEM, image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2933060/library_600x900.jpg' },
  { id: 'bo7', name: 'Call of Duty: Black Ops 7', year: 2025, system: GameSystem.GEAR_SYSTEM, image: 'https://images.unsplash.com/photo-1503149779833-1de50ebe5f8a?auto=format&fit=crop&q=80&w=400' },
];
