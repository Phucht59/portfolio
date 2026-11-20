import { Link } from 'react-router';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { featuredProjects, projects, site } from '../content/projects';
import type { Locale } from '../content/types';

export function SelectedWork() {
  const { i18n } = useTranslation();
  const locale: Locale = i18n.language.startsWith('vi') ? 'vi' : 'en';
  return <section id="work" className="selected-work" aria-labelledby="selected-title">
    <p className="label">03 / {locale === 'vi' ? 'Dự án tiêu biểu' : 'Selected work'}</p>
    <h2 id="selected-title">{locale === 'vi' ? 'Dữ liệu. Bài toán. Tác động.' : 'Real questions. Thoughtful systems.'}</h2>
    <p className="selected-intro">{locale === 'vi' ? 'Hai dự án thể hiện cách tôi tiếp cận dữ liệu và xây dựng giải pháp.' : 'Two projects that bring my approach to data and decision-making into focus.'}</p>
    <div className="selected-grid">{featuredProjects.map(project => <Link className="selected-card" to={project.route} key={project.id}>
      <div className={'project-cover project-cover--' + project.id} aria-hidden="true">
        <span className="project-cover__index">{project.number}</span>
        <div className="project-cover__flow">{(project.workflow ?? (project.id === 'student-risk' ? ['Data', 'Risk', 'Support'] : ['Query', 'Search', 'Insight'])).slice(0, 3).map((s, i) => <span key={i}>{s}</span>)}</div>
        <span className="project-cover__caption">{project.stack.slice(0, 3).join(' / ')}</span>
      </div>
      <div className="selected-card__copy"><p className="label">{project.number} / {project.type[locale]}</p><h3>{project.title[locale]}</h3><p>{project.summary[locale]}</p><span className="text-link">{locale === 'vi' ? 'Khám phá dự án' : 'Explore project'} <ArrowRight size={17}/></span></div>
    </Link>)}</div>
  </section>;
}

export function Resume() {
  const { t, i18n } = useTranslation();
  const vi = i18n.language.startsWith('vi');
  const tools = [...new Set(projects.flatMap(p => p.stack))];
  return <section id="resume" className="resume" aria-labelledby="resume-title">
    <p className="label">06 / {t('nav.resume')}</p><h2 id="resume-title">{vi ? 'Nền tảng & hướng phát triển.' : 'A foundation for what comes next.'}</h2>
    <div className="resume-grid"><div><h3>{t('home.education')}</h3><p>{t('home.educationMeta')}</p><p>{site.availability[vi ? 'vi' : 'en']}</p><a className="btn btn--primary" href="/cv.pdf" download>{vi ? 'Tải CV' : 'Download CV'} <ArrowDown size={16}/></a></div>
    <div><h3>{vi ? 'Công cụ trong các dự án' : 'Tools used in my projects'}</h3><ul className="skill-list">{tools.map(tool => <li key={tool}>{tool}</li>)}</ul></div></div>
  </section>;
}

export function ChapterRail() {
  const { i18n } = useTranslation(); const vi=i18n.language.startsWith('vi');
  const names=vi?['Giới thiệu','Về tôi','Dự án','Tiêu điểm','Dự án khác','Hồ sơ','Liên hệ']:['Hero','About','Work','Featured','More','Resume','Contact'];
  return <nav className="chapter-rail" aria-label={vi?'Các phần nội dung':'Page chapters'}>{['hero','about','work','featured','more-work','resume','contact'].map((id,i)=><a href={'#'+id} key={id}><span>0{i+1}</span><span>{names[i]}</span></a>)}</nav>;
}
