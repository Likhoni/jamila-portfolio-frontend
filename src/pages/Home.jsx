import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import PageContainer from '../components/layout/PageContainer';
import Hero from '../components/home/Hero';
import AboutPreview from '../components/home/AboutPreview';
import SkillGrid from '../components/home/SkillGrid';
import ExperienceTimeline from '../components/home/ExperienceTimeline';
import FeaturedProjects from '../components/home/FeaturedProjects';
import LatestPosts from '../components/home/LatestPosts';
import ContactCTA from '../components/home/ContactCTA';
import Skeleton from '../components/ui/Skeleton';

import { profileApi } from '../api/profile';
import { skillsApi } from '../api/skills';
import { experienceApi } from '../api/experience';
import { projectsApi } from '../api/projects';
import { postsApi } from '../api/posts';

export default function Home() {
  // Dynamic Document Title and SEO
  useEffect(() => {
    document.title = 'Jamila Islam Likhoni — Software Engineer & Laravel Developer';
  }, []);

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await profileApi.getProfile();
      return res.data;
    },
  });

  const { data: skills = [] } = useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      const res = await skillsApi.getSkills();
      return res.data;
    },
  });

  const { data: experiences = [] } = useQuery({
    queryKey: ['experiences'],
    queryFn: async () => {
      const res = await experienceApi.getExperiences();
      return res.data;
    },
  });

  const { data: projectsData } = useQuery({
    queryKey: ['projects', 'featured'],
    queryFn: async () => {
      const res = await projectsApi.getProjects();
      return res.data?.results || res.data || [];
    },
  });

  const { data: postsData } = useQuery({
    queryKey: ['posts', 'latest'],
    queryFn: async () => {
      const res = await postsApi.getPosts({ page_size: 3 });
      return res.data?.results || res.data || [];
    },
  });

  return (
    <PageContainer>
      {/* 1. Hero */}
      <Hero profile={profile} />

      {/* 2. About Preview */}
      <AboutPreview profile={profile} />

      {/* 3. Skills Grouped by Category */}
      <SkillGrid skills={skills} />

      {/* 4. Experience Timeline */}
      <ExperienceTimeline experiences={experiences} />

      {/* 5. Featured Projects (Exactly 3 cards) */}
      <FeaturedProjects projects={projectsData || []} />

      {/* 6. Latest Blog Posts (Exactly 3 cards) */}
      <LatestPosts posts={postsData || []} />

      {/* 7. Contact CTA */}
      <ContactCTA />
    </PageContainer>
  );
}
