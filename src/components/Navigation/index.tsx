'use client';

import { TabItem, Tabs } from '@worldcoin/mini-apps-ui-kit-react';
import { Home, User, Leaderboard } from 'iconoir-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

/**
 * This component uses the UI Kit to navigate between pages
 * Bottom navigation is the most common navigation pattern in Mini Apps
 * We require mobile first design patterns for mini apps
 * Read More: https://docs.world.org/mini-apps/design/app-guidelines#mobile-first
 */

export const Navigation = () => {
  const [value, setValue] = useState('home');
  const router = useRouter();
  const handleValueChange = (value: string) => {
    setValue(value);
    router.push(value);
  };

  return (
    <Tabs value={value} onValueChange={handleValueChange}>
      <TabItem value="home" icon={<Home />} label="Inicio" />
      {/* // TODO: These currently don't link anywhere */}
      <TabItem value="stats" icon={<Leaderboard />} label="Estadísticas" />
      <TabItem value="profile" icon={<User />} label="Perfil" />
    </Tabs>
  );
};
