-- Seed Data for Portfolio Development
-- Run this after the migration to populate tables with sample data.
-- Execute via the Supabase SQL Editor or CLI.

-- Profile
INSERT INTO profiles (full_name, title, tagline, bio, avatar_url, resume_url, email, phone, location, github_url, linkedin_url)
VALUES (
  'Aung Kaung Myat',
  'Full Stack Developer',
  'Building modern web applications with React, Next.js, and cloud-native technologies',
  'I am a passionate full stack developer with experience building scalable web applications and cloud-native solutions. I specialize in React, Next.js, TypeScript, and Node.js, with a strong foundation in both frontend and backend development. I enjoy solving complex problems and creating intuitive user experiences that make a real impact.',
  'https://YOUR_SUPABASE_URL.supabase.co/storage/v1/object/public/avatars/profile.jpg',
  'https://YOUR_SUPABASE_URL.supabase.co/storage/v1/object/public/documents/resume.pdf',
  'aungkaungmyat@example.com',
  '+1 (555) 123-4567',
  'San Francisco, CA',
  'https://github.com/aungkaungmyat',
  'https://linkedin.com/in/aungkaungmyat'
);

-- Projects
INSERT INTO projects (title, slug, short_description, full_description, tech_stack, github_url, live_url, thumbnail_url, featured, display_order)
VALUES
(
  'TaskFlow',
  'taskflow',
  'A collaborative project management tool with real-time updates and Kanban boards.',
  'TaskFlow is a full-featured project management application designed for teams. It supports real-time collaborative editing, drag-and-drop Kanban boards, sprint planning, and automated notifications. Built with a React frontend and Node.js backend, it uses WebSockets for real-time updates and PostgreSQL for persistent storage. The application includes role-based access control, file attachments, and integration with GitHub for issue tracking.',
  ARRAY['React', 'Node.js', 'PostgreSQL', 'WebSocket', 'TypeScript'],
  'https://github.com/aungkaungmyat/taskflow',
  'https://taskflow-demo.vercel.app',
  'https://YOUR_SUPABASE_URL.supabase.co/storage/v1/object/public/projects/taskflow-thumb.jpg',
  true,
  1
),
(
  'DataPulse API',
  'datapulse-api',
  'A high-performance REST API for real-time analytics and data processing.',
  'DataPulse is a backend API service built with Python and FastAPI that handles real-time data ingestion, transformation, and analytics. It processes millions of events per day using async workers and Redis queues. The API features automatic OpenAPI documentation, rate limiting, JWT authentication, and comprehensive test coverage. Deployed on AWS with auto-scaling and monitoring via CloudWatch.',
  ARRAY['Python', 'FastAPI', 'Redis', 'AWS', 'Docker'],
  'https://github.com/aungkaungmyat/datapulse-api',
  NULL,
  'https://YOUR_SUPABASE_URL.supabase.co/storage/v1/object/public/projects/datapulse-thumb.jpg',
  true,
  2
),
(
  'DevBlog',
  'devblog',
  'A developer blog platform with MDX support, syntax highlighting, and SEO optimization.',
  'DevBlog is a modern blogging platform built specifically for developers. It uses Next.js with Supabase for the backend, supports MDX for rich content authoring, and includes code syntax highlighting with Shiki. Features include tag-based categorization, full-text search, RSS feed generation, and automatic OG image generation. The admin dashboard allows for post management, draft saving, and analytics viewing.',
  ARRAY['Next.js', 'Supabase', 'TypeScript', 'MDX', 'Tailwind CSS'],
  'https://github.com/aungkaungmyat/devblog',
  'https://devblog-demo.vercel.app',
  'https://YOUR_SUPABASE_URL.supabase.co/storage/v1/object/public/projects/devblog-thumb.jpg',
  false,
  3
),
(
  'CloudDeploy CLI',
  'clouddeploy-cli',
  'A command-line tool for simplified cloud infrastructure deployment and management.',
  'CloudDeploy is a CLI tool that simplifies deploying and managing cloud infrastructure across multiple providers. Written in Go, it provides a unified interface for provisioning servers, managing DNS, configuring load balancers, and monitoring deployments. It supports AWS, GCP, and DigitalOcean with a plugin architecture for extensibility. The tool includes rollback capabilities, environment management, and infrastructure-as-code templates.',
  ARRAY['Go', 'AWS', 'Docker', 'Terraform'],
  'https://github.com/aungkaungmyat/clouddeploy-cli',
  NULL,
  'https://YOUR_SUPABASE_URL.supabase.co/storage/v1/object/public/projects/clouddeploy-thumb.jpg',
  false,
  4
);

-- Project Images (using project slugs to reference -- you'll need to replace with actual UUIDs after projects are inserted)
-- For simplicity, we insert using subqueries to get the project IDs
INSERT INTO project_images (project_id, image_url, alt_text, display_order)
VALUES
-- TaskFlow images
((SELECT id FROM projects WHERE slug = 'taskflow'), 'https://YOUR_SUPABASE_URL.supabase.co/storage/v1/object/public/projects/taskflow-1.jpg', 'TaskFlow Kanban board view', 1),
((SELECT id FROM projects WHERE slug = 'taskflow'), 'https://YOUR_SUPABASE_URL.supabase.co/storage/v1/object/public/projects/taskflow-2.jpg', 'TaskFlow sprint planning dashboard', 2),
((SELECT id FROM projects WHERE slug = 'taskflow'), 'https://YOUR_SUPABASE_URL.supabase.co/storage/v1/object/public/projects/taskflow-3.jpg', 'TaskFlow team collaboration view', 3),
-- DataPulse images
((SELECT id FROM projects WHERE slug = 'datapulse-api'), 'https://YOUR_SUPABASE_URL.supabase.co/storage/v1/object/public/projects/datapulse-1.jpg', 'DataPulse API documentation', 1),
((SELECT id FROM projects WHERE slug = 'datapulse-api'), 'https://YOUR_SUPABASE_URL.supabase.co/storage/v1/object/public/projects/datapulse-2.jpg', 'DataPulse analytics dashboard', 2),
-- DevBlog images
((SELECT id FROM projects WHERE slug = 'devblog'), 'https://YOUR_SUPABASE_URL.supabase.co/storage/v1/object/public/projects/devblog-1.jpg', 'DevBlog home page', 1),
((SELECT id FROM projects WHERE slug = 'devblog'), 'https://YOUR_SUPABASE_URL.supabase.co/storage/v1/object/public/projects/devblog-2.jpg', 'DevBlog post editor with MDX', 2),
-- CloudDeploy images
((SELECT id FROM projects WHERE slug = 'clouddeploy-cli'), 'https://YOUR_SUPABASE_URL.supabase.co/storage/v1/object/public/projects/clouddeploy-1.jpg', 'CloudDeploy CLI terminal output', 1),
((SELECT id FROM projects WHERE slug = 'clouddeploy-cli'), 'https://YOUR_SUPABASE_URL.supabase.co/storage/v1/object/public/projects/clouddeploy-2.jpg', 'CloudDeploy infrastructure diagram', 2);

-- Work Experience
INSERT INTO experiences (company, role, description, start_date, end_date, is_current, display_order)
VALUES
(
  'TechCorp Solutions',
  'Senior Full Stack Developer',
  'Lead development of customer-facing web applications serving 50K+ daily active users. Architected a micro-frontend system that reduced deployment time by 60%. Mentored a team of 4 junior developers and established code review practices. Implemented CI/CD pipelines with GitHub Actions and automated testing coverage to 85%.',
  '2023-06-01',
  NULL,
  true,
  1
),
(
  'StartupHub Inc.',
  'Full Stack Developer',
  'Built and maintained a SaaS platform for small business management using React, Node.js, and PostgreSQL. Designed and implemented RESTful APIs handling 10K+ requests per minute. Integrated third-party payment processing with Stripe and automated invoice generation. Reduced page load times by 40% through code splitting and image optimization.',
  '2021-03-01',
  '2023-05-31',
  false,
  2
),
(
  'Digital Agency Co.',
  'Junior Web Developer',
  'Developed responsive websites and web applications for various clients across industries. Collaborated with designers to implement pixel-perfect UI using HTML, CSS, and JavaScript. Built custom WordPress themes and plugins for content management. Participated in agile development sprints and daily standups.',
  '2019-09-01',
  '2021-02-28',
  false,
  3
);

-- Education
INSERT INTO education (institution, degree, field_of_study, start_date, end_date, description, display_order)
VALUES
(
  'University of Technology',
  'Bachelor of Science',
  'Computer Science',
  '2015-09-01',
  '2019-06-30',
  'Graduated with honors. Focused on software engineering, algorithms, and distributed systems. Completed a capstone project on real-time collaborative editing systems.',
  1
),
(
  'Online Academy',
  'Professional Certificate',
  'Cloud Architecture',
  '2022-01-01',
  '2022-06-30',
  'Completed intensive program covering AWS services, infrastructure as code, containerization, and cloud-native application design patterns.',
  2
);

-- Skills
INSERT INTO skills (name, category, display_order)
VALUES
-- Frontend
('React', 'Frontend', 1),
('TypeScript', 'Frontend', 2),
('Next.js', 'Frontend', 3),
('Tailwind CSS', 'Frontend', 4),
('HTML/CSS', 'Frontend', 5),
-- Backend
('Node.js', 'Backend', 1),
('Python', 'Backend', 2),
('PostgreSQL', 'Backend', 3),
('REST APIs', 'Backend', 4),
-- Tools & DevOps
('Git', 'Tools & DevOps', 1),
('Docker', 'Tools & DevOps', 2),
('AWS', 'Tools & DevOps', 3),
('CI/CD', 'Tools & DevOps', 4),
('Linux', 'Tools & DevOps', 5);
