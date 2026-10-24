import React, { useState, useEffect } from 'react';
import './App.css';
import { db } from './firebase';
import { collection, doc, getDoc, runTransaction } from 'firebase/firestore';
import {
  Folder,
  UploadCloud,
  Activity,
  BarChart2,
  Zap,
  Eye,
  Shield,
  Globe,
  Users,
  Link,
  Box,
  Database,
  Flag,
  Search,
  MoreHorizontal,
  ArrowRight,
  ArrowLeft,
  Menu,
  X,
  CheckCircle2,
  Loader2,
  Check
} from 'lucide-react';

import {
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaLinkedin
} from 'react-icons/fa6';

import logo from './assets/TrackUGClogo.png';
import doodle1 from './assets/Doodle1.png';
import doodle2 from './assets/Doodle2.png';
import doodle3 from './assets/Doodle3.png';

const waitlistCounterRef = doc(db, 'settings', 'waitlistCounter');

const DUMMY_CREATORS = [
  {
    id: 1,
    name: 'Sarah Jenkins',
    avatar: 'https://i.pravatar.cc/150?img=1',
    platforms: ['instagram', 'tiktok'],
    campaign: 'Summer Splash 2024',
    status: 'Approved',
    updated: '2 hours ago'
  },
  {
    id: 2,
    name: 'Marcus Chen',
    avatar: 'https://i.pravatar.cc/150?img=11',
    platforms: ['youtube'],
    campaign: 'Tech Review Series',
    status: 'Needs Revision',
    updated: '5 hours ago'
  },
  {
    id: 3,
    name: 'Elena Rodriguez',
    avatar: 'https://i.pravatar.cc/150?img=5',
    platforms: ['instagram', 'youtube'],
    campaign: 'Fitness Challenge Q3',
    status: 'Waiting for Submission',
    updated: '1 day ago'
  },
  {
    id: 4,
    name: 'David Kim',
    avatar: 'https://i.pravatar.cc/150?img=8',
    platforms: ['tiktok'],
    campaign: 'Viral Dance Trend',
    status: 'Live',
    updated: '10 mins ago'
  },
  {
    id: 5,
    name: 'Jessica Taylor',
    avatar: 'https://i.pravatar.cc/150?img=9',
    platforms: ['instagram'],
    campaign: 'Skincare Routine',
    status: 'Scheduled',
    updated: '3 hours ago'
  },
  {
    id: 6,
    name: 'Tom Hardy',
    avatar: 'https://i.pravatar.cc/150?img=12',
    platforms: ['youtube', 'linkedin'],
    campaign: 'Gaming Setup Tour',
    status: 'Overdue',
    updated: '2 days ago'
  },
  {
    id: 7,
    name: 'Aisha Patel',
    avatar: 'https://i.pravatar.cc/150?img=20',
    platforms: ['instagram', 'tiktok'],
    campaign: 'Summer Splash 2024',
    status: 'Approved',
    updated: '1 hour ago'
  },
  {
    id: 8,
    name: 'Chris Wilson',
    avatar: 'https://i.pravatar.cc/150?img=33',
    platforms: ['youtube'],
    campaign: 'Tech Review Series',
    status: 'Live',
    updated: '4 hours ago'
  }
];

const PLATFORM_ICONS = {
  instagram: <FaInstagram size={14} />,
  youtube: <FaYoutube size={14} />,
  linkedin: <FaLinkedin size={14} />,
  tiktok: <FaTiktok size={14} />
};

const STATUS_CLASSES = {
  'Approved': 'status-approved',
  'Needs Revision': 'status-needs-revision',
  'Waiting for Submission': 'status-waiting',
  'Scheduled': 'status-scheduled',
  'Live': 'status-live',
  'Overdue': 'status-overdue'
};

function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    return window.location.hash === '#/waitlist' ? 'waitlist' : 'home';
  });
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [waitlistCount, setWaitlistCount] = useState(null);
  const [waitlistCountError, setWaitlistCountError] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let isActive = true;
    getDoc(waitlistCounterRef)
      .then((snapshot) => {
        if (isActive) setWaitlistCount(snapshot.exists() ? snapshot.data().count : 0);
      })
      .catch((error) => {
        console.error('Error loading waitlist count:', error);
        if (isActive) setWaitlistCountError(true);
      });

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleHash = () => {
      const page = window.location.hash === '#/waitlist' ? 'waitlist' : 'home';
      setCurrentPage(page);
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const navigateTo = (page, targetId = null) => {
    setMobileMenuOpen(false);
    if (page === 'waitlist') {
      window.location.hash = '#/waitlist';
      setCurrentPage('waitlist');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.location.hash = '#/';
      setCurrentPage('home');
      if (targetId) {
        setTimeout(() => {
          smoothScrollTo(targetId);
        }, 80);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const smoothScrollTo = (targetId, duration = 900) => {
    setMobileMenuOpen(false);
    if (currentPage !== 'home') {
      navigateTo('home', targetId);
      return;
    }
    const target = document.getElementById(targetId);
    if (!target) return;

    const headerOffset = 70;
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    const easeInOutCubic = (t) => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    const step = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const ease = easeInOutCubic(progress);

      window.scrollTo(0, startPosition + distance * ease);

      if (timeElapsed < duration) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.trim()) return;
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const emailRef = doc(collection(db, 'waitlist'));
      const normalizedEmail = email.trim().toLowerCase();
      const nextCount = await runTransaction(db, async (transaction) => {
        const counterSnapshot = await transaction.get(waitlistCounterRef);
        const count = counterSnapshot.exists() ? counterSnapshot.data().count : 0;
        const updatedCount = count + 1;

        transaction.set(emailRef, {
          email: normalizedEmail,
          timestamp: new Date()
        });
        transaction.set(waitlistCounterRef, {
          count: updatedCount,
          lastEntryId: emailRef.id
        });

        return updatedCount;
      });
      setIsSubmitted(true);
      setEmail('');
      setWaitlistCount(nextCount);
      setWaitlistCountError(false);
    } catch (error) {
      console.error("Error adding document: ", error);
      setErrorMsg("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className={`site-header ${scrolled ? 'header-scrolled' : ''}`}>
        <div className="header-container">
          <a
            href="#"
            className="brand-logo"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('home');
            }}
          >
            <img src={logo} alt="TrackUGC Logo" className="brand-logo-img" />
            <span className="brand-name">TrackUGC</span>
          </a>

          {/* Desktop Navigation */}
          <nav className="header-nav">
            <button className="nav-link" onClick={() => navigateTo('home', 'preview')}>
              Platform
            </button>
            <button className="nav-link" onClick={() => navigateTo('home', 'features')}>
              Features
            </button>
            <button className="nav-link" onClick={() => navigateTo('home', 'comparison')}>
              Why TrackUGC
            </button>
            <button className="nav-link" onClick={() => navigateTo('waitlist')}>
              Waitlist
            </button>
          </nav>

          {/* Header Action Buttons */}
          <div className="header-actions">
            <button className="header-cta-btn" onClick={() => navigateTo('waitlist')}>
              <span>Join Waitlist</span>
              <span aria-hidden="true">&gt;&gt;</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              className="mobile-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="mobile-nav-drawer">
            <button className="mobile-nav-link" onClick={() => navigateTo('home', 'preview')}>
              Platform
            </button>
            <button className="mobile-nav-link" onClick={() => navigateTo('home', 'features')}>
              Features
            </button>
            <button className="mobile-nav-link" onClick={() => navigateTo('home', 'comparison')}>
              Why TrackUGC
            </button>
            <button className="mobile-nav-link" onClick={() => navigateTo('waitlist')}>
              Waitlist
            </button>
            <div className="mobile-nav-divider"></div>
            <button className="mobile-cta-btn" onClick={() => navigateTo('waitlist')}>
              <span>Signup for free</span>
              <ArrowRight size={15} />
            </button>
          </div>
        )}
      </header>

      <div className="spots-counter" aria-live="polite">
        {waitlistCountError && waitlistCount === null
          ? 'Count unavailable'
          : waitlistCount === null
            ? 'Loading count...'
            : `${waitlistCount}/20 spots taken`}
      </div>

      {/* Page Content */}
      {currentPage === 'waitlist' ? (
        <main className="waitlist-view">
          <section className="hero waitlist-hero">
            <div className="hero-content">
              {/* Centered TrackUGC Logo */}
              <div className="waitlist-logo-container">
                <img src={logo} alt="TrackUGC Logo" className="waitlist-hero-logo" />
              </div>

              <h1>Join the TrackUGC Waitlist</h1>
              <p>
                Stop managing UGC campaigns across WhatsApp, Sheets and Chaos. Enter your work email below to get early access.
              </p>

              {!isSubmitted ? (
                <form className="waitlist-inline-form" onSubmit={handleSubmit}>
                  <div className="waitlist-input-wrapper">
                    <input
                      type="email"
                      required
                      placeholder="Enter your work email..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="waitlist-input"
                      disabled={isSubmitting}
                      autoFocus
                    />
                  </div>
                  <button type="submit" className="cta-button waitlist-btn" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="spinner-icon" />
                        <span>Joining...</span>
                      </>
                    ) : (
                      <>
                        <span>Join waitlist</span>
                        <ArrowRight size={15} />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="waitlist-success-card">
                  <div className="success-icon-wrap">
                    <CheckCircle2 size={40} className="success-check-icon" />
                  </div>
                  <h3>You're on the waitlist!</h3>
                  <p>
                    Thanks for signing up. You're officially on the list and we'll email you soon with early access details.
                  </p>
                  <button
                    type="button"
                    className="waitlist-reset-btn"
                    onClick={() => setIsSubmitted(false)}
                  >
                    Sign up another email
                  </button>
                </div>
              )}

              {errorMsg && <p className="waitlist-error">{errorMsg}</p>}
            </div>

            {/* Doodles framing the hero */}
            <div className="doodle img-doodle doodle-1">
              <img src={doodle1} alt="" />
            </div>
            <div className="doodle img-doodle doodle-2">
              <img src={doodle2} alt="" />
            </div>
            <div className="doodle img-doodle doodle-3">
              <img src={doodle3} alt="" />
            </div>
          </section>

          <footer className="site-footer">
            <div className="footer-inner container">
              <div className="footer-brand">
                <img src={logo} alt="TrackUGC" className="brand-logo-img" />
                <span>TrackUGC</span>
              </div>
              <p>© {new Date().getFullYear()} TrackUGC. All rights reserved.</p>
            </div>
          </footer>
        </main>
      ) : (
        <>
          {/* Hero Section */}
          <section className="hero home-hero">
            <div className="hero-content">
              <p className="hero-offer">
                <span className="hero-offer-dot" aria-hidden="true" />
                <span>First 20 early birds:</span>
                <strong>$49/month</strong>
                <span className="hero-offer-compare">instead of <s>$99</s></span>
              </p>
              <h1>
                <span className="hero-underline">
                  Pain-free
                  <svg className="hero-underline-strokes" viewBox="0 0 260 26" aria-hidden="true">
                    <path d="M2 14 L32 11 L66 9 L101 7 L137 6 L171 6 L199 5 L216 5 L222 7 L220 9 L210 10 L190 9 L166 9 L140 10 L115 12 L91 14 L74 17 L65 19 L68 21 L80 19 L105 17 L133 17 L163 18 L194 20 L226 22 L258 24" />
                  </svg>
                </span>{" "}
                UGC Campaign management software
              </h1>
              <p className="hero-description">
                Track every creator, draft, approval, revision, deadline, live link and winning format in one single organized workspace.
              </p>
              <button className="cta-button" onClick={() => navigateTo('waitlist')}>
                Signup for free <span>&gt;&gt;</span>
              </button>
              <p className="hero-subnote">No payment now • founding price locked in</p>
            </div>

        {/* Doodles - Moved back outside to ensure proper background blending */}
        <div className="doodle img-doodle doodle-1">
          <img src={doodle1} alt="" />
        </div>
        <div className="doodle img-doodle doodle-2">
          <img src={doodle2} alt="" />
        </div>
        <div className="doodle img-doodle doodle-3">
          <img src={doodle3} alt="" />
        </div>
      </section>

      {/* Dashboard Section */}
      <section className="dashboard-wrapper" id="preview">
        <div className="dashboard">

          {/* Sidebar */}
          <aside className="sidebar">
            <div className="sidebar-header">
              <div className="sidebar-avatar"></div>
              <span>TrackUGC Team</span>
            </div>

            <div className="sidebar-search">
              <Search />
              <input type="text" placeholder="Search..." />
            </div>

            <nav className="sidebar-nav">
              <div className="nav-item active">
                <Folder /> Campaigns
              </div>
              <div className="nav-item">
                <UploadCloud /> Submissions
              </div>
              <div className="nav-item">
                <Activity /> Activity
              </div>
              <div className="nav-item">
                <BarChart2 /> Performance
              </div>
              <div className="nav-item">
                <Zap /> Winning Content
              </div>
              <div className="nav-item">
                <Eye /> Workflow
              </div>
              <div className="nav-item">
                <Shield /> Approvals
              </div>
              <div className="nav-item">
                <Globe /> Live Content
              </div>
              <div className="nav-item">
                <Users /> Creators
              </div>
              <div className="nav-item">
                <Link /> Channels
              </div>
              <div className="nav-item">
                <Box /> Integrations
              </div>
              <div className="nav-item">
                <Database /> Asset Library
              </div>
              <div className="nav-item">
                <Flag /> Briefs
              </div>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="main-content">
            <div className="top-nav">
              <div className="top-nav-tabs">
                <div className="top-nav-tab active">Overview</div>
                <div className="top-nav-tab">Analytics</div>
                <div className="top-nav-tab">Settings</div>
              </div>
            </div>

            <div className="content-area">
              <div className="content-header">
                <div className="search-bar">
                  <input type="text" placeholder="Search creators, campaigns..." />
                </div>
                <button className="primary-btn">Add New...</button>
              </div>

              <div className="cards-grid">
                {DUMMY_CREATORS.map(creator => (
                  <div key={creator.id} className="creator-card">
                    <div className="card-header">
                      <div className="creator-info">
                        <img src={creator.avatar} alt={creator.name} className="avatar" />
                        <div className="creator-details">
                          <h3>{creator.name}</h3>
                          <span className="campaign-name">{creator.campaign}</span>
                        </div>
                      </div>
                      <div className="platforms">
                        {creator.platforms.map(p => (
                          <div key={p} className="platform-badge" title={p}>
                            {PLATFORM_ICONS[p]}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="card-body">
                      <div className={`status-badge ${STATUS_CLASSES[creator.status]}`}>
                        <span className="status-dot"></span>
                        {creator.status}
                      </div>
                    </div>

                    <div className="card-footer">
                      <span>Updated {creator.updated}</span>
                      <MoreHorizontal size={16} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>

        </div>
      </section>

      {/* Pain Section */}
      <section className="pain-section container">
        <div className="pain-grid">
          <div className="pain-left">
            <div className="messy-stack">
              <div className="messy-item whatsapp">WhatsApp bubbles</div>
              <div className="messy-item sheets">Google Sheets</div>
              <div className="messy-item drive">Drive folders</div>
              <div className="messy-item slack">Slack messages</div>
              <div className="messy-item file">"Final_v4_REAL.mp4"</div>
              <div className="messy-item warning">missed deadline warning</div>
              <div className="messy-item approval">approval DM</div>
              <div className="messy-item links">scattered links</div>
            </div>
          </div>
          <div className="pain-right">
            <h2>Scaling UGC campaigns gets messy fast.</h2>
            <p className="pain-subtitle">It becomes a headache to know:</p>
            <ul className="pain-bullets">
              <li>Which creators have submitted?</li>
              <li>Which videos got approved ?</li>
              <li>What's still missing?</li>
              <li>What's gone live?</li>
              <li>Where all the links are?</li>
              <li>Which content is performing well?</li>
            </ul>

          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="features-section container" id="features">
        <h2 className="section-title">How TrackUGC helps you.</h2>
        <div className="features-grid">

          <div className="feature-card">
            <div className="feature-mockup">
              <div className="mockup-header">Creator Submissions</div>
              <div className="mockup-body">
                <div className="mockup-row"><span className="mockup-badge status-live">Submitted</span> Sarah Jenkins - Due today</div>
                <div className="mockup-row"><span className="mockup-badge status-waiting">Pending</span> David Kim - Due tmrw</div>
                <div className="mockup-row"><span className="mockup-badge status-overdue">Overdue</span> Tom Hardy - 2 days ago</div>
              </div>
            </div>
            <div className="feature-content">
              <h3>Track creator submissions in one place</h3>
              <p>See exactly who submitted content, what still needs review, and which creators are overdue.</p>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-mockup">
              <div className="mockup-header">Approvals</div>
              <div className="mockup-body">
                <div className="mockup-comment">"Revision Requested: Please change the hook"</div>
                <div className="mockup-action"><button className="mockup-btn approve">Approve</button> <button className="mockup-btn reject">Reject</button></div>
                <div className="mockup-note">Approved by Sarah (V2)</div>
              </div>
            </div>
            <div className="feature-content">
              <h3>Keep approvals and revisions organized</h3>
              <p>Review content, request changes, and approve assets without losing feedback in chats and DMs.</p>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-mockup">
              <div className="mockup-header">Asset Library</div>
              <div className="mockup-body mockup-flex">
                <div className="mockup-thumb">V1</div>
                <div className="mockup-thumb">V2</div>
                <div className="mockup-thumb final">Final</div>
              </div>
              <div className="mockup-link">Live: tiktok.com/@creator/video</div>
            </div>
            <div className="feature-content">
              <h3>Keep every draft, version, and live link together</h3>
              <p>Store creator uploads, revisions, final exports, and published links in one organized workspace.</p>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-mockup">
              <div className="mockup-header">Campaign Overview</div>
              <div className="mockup-body">
                <div className="mockup-progress">
                  <div className="progress-bar" style={{ width: '60%' }}></div>
                </div>
                <div className="mockup-stats">
                  <span>12 Creators</span>
                  <span>24 Assets</span>
                </div>
                <div className="mockup-badges">
                  <span className="mockup-badge status-waiting">Recording</span>
                  <span className="mockup-badge status-needs-revision">Under Review</span>
                </div>
              </div>
            </div>
            <div className="feature-content">
              <h3>See the status of every campaign instantly</h3>
              <p>Get a real-time overview of what's pending, approved, delayed, and already live.</p>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-mockup">
              <div className="mockup-header">Timeline</div>
              <div className="mockup-body">
                <div className="mockup-timeline-item warning">
                  <span className="date">Oct 12</span> Deliverable Overdue (Jessica)
                </div>
                <div className="mockup-timeline-item">
                  <span className="date">Oct 14</span> Review Deadline (Summer Splash)
                </div>
              </div>
            </div>
            <div className="feature-content">
              <h3>Never lose track of deadlines again</h3>
              <p>Track submission deadlines, overdue deliverables, and campaign timelines from one dashboard.</p>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-mockup">
              <div className="mockup-header">Performance</div>
              <div className="mockup-body">
                <div className="mockup-row space-between"><span>Marcus Chen</span> <span className="highlight">3.2x ROAS</span></div>
                <div className="mockup-row space-between"><span>"Unboxing Hook"</span> <span className="highlight">4.5% CTR</span></div>
                <div className="mockup-winner">🏆 Winning Format</div>
              </div>
            </div>
            <div className="feature-content">
              <h3>See which creators and hooks actually perform</h3>
              <p>Identify your best-performing creators, content styles, and hooks faster.</p>
            </div>
          </div>

        </div>
      </section>

      {/* Built For Section */}
      <section className="built-for">
        <h2>
          Built for teams scaling UGC campaigns.
          <img src={doodle1} className="inline-doodle" alt="" />
        </h2>
      </section>

      {/* Before / After Section */}
      <section className="before-after-section container" id="comparison">
        <h2 className="section-title">From scattered workflows to organized campaigns</h2>
        <div className="comparison-grid">

          <div className="comparison-card before">
            <div className="comparison-header">
              <h3>Without TrackUGC</h3>
            </div>
            <ul className="comparison-list">
              <li><span className="cross">✕</span> approvals buried in DMs</li>
              <li><span className="cross">✕</span> scattered Drive folders</li>
              <li><span className="cross">✕</span> spreadsheets constantly outdated</li>
              <li><span className="cross">✕</span> creators needing manual follow-ups</li>
              <li><span className="cross">✕</span> unclear campaign status</li>
              <li><span className="cross">✕</span> missing live links</li>
            </ul>
            <div className="comparison-visual messy">
              <div className="visual-item">File_Final_v2.mp4</div>
              <div className="visual-item">"Did she post yet?"</div>
              <div className="visual-item">Google Sheet (View Only)</div>
            </div>
          </div>

          <div className="comparison-card after">
            <div className="comparison-header">
              <h3>With TrackUGC</h3>
            </div>
            <ul className="comparison-list">
              <li><span className="check">✓</span> centralized creator tracking</li>
              <li><span className="check">✓</span> organized approvals and revisions</li>
              <li><span className="check">✓</span> real-time campaign visibility</li>
              <li><span className="check">✓</span> every asset and link in one place</li>
              <li><span className="check">✓</span> clear deadlines and statuses</li>
              <li><span className="check">✓</span> performance tied to content</li>
            </ul>
            <div className="comparison-visual clean">
              <div className="visual-item organized"><span className="status-live">Live</span> Summer Campaign Active</div>
              <div className="visual-item organized"><span className="status-approved">Approved</span> 12/12 Videos Ready</div>
            </div>
          </div>

        </div>
      </section>

      {/* Closing CTA Section */}
      <section className="closing-cta-section container">
        <div className="closing-cta-card">
          <h2>Ready to scale your UGC without the chaos?</h2>
          <p>
            Track every creator, draft, revision, deadline, and winning format in one organized workspace.
          </p>
          <button className="cta-button" onClick={() => navigateTo('waitlist')}>
            Signup for free <span>&gt;&gt;</span>
          </button>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-inner container">
          <div className="footer-brand">
            <img src={logo} alt="TrackUGC" className="brand-logo-img" />
            <span>TrackUGC</span>
          </div>
          <p>© {new Date().getFullYear()} TrackUGC. All rights reserved.</p>
        </div>
      </footer>
    </>
  )}

</div>
  );
}

export default App;
