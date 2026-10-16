import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from './Navbar';
import Footer from './Footer';
import { profileApi } from '../../api/profile';

export default function PageContainer({ children }) {
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await profileApi.getProfile();
      return res.data;
    },
    staleTime: 1000 * 60 * 10,
  });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: 'var(--bg-primary)',
      }}
    >
      <Navbar profile={profile} />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer profile={profile} />
    </div>
  );
}
