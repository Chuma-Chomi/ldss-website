import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, GraduationCap, Users, Award, MapPin, Phone, Mail, User } from 'lucide-react';

// Add CSS for custom icons
const iconStyle = document.createElement('style');
iconStyle.textContent = `
  .icon-book {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%);
    border-radius: 6px;
    position: relative;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .icon-book::before {
    content: '';
    position: absolute;
    width: 24px;
    height: 2px;
    background: white;
    box-shadow: 0 6px 0 white, 0 12px 0 white, 0 18px 0 white;
  }
  .icon-graduation {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%);
    border-radius: 24px 24px 0 0;
    position: relative;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .icon-graduation::before {
    content: '';
    position: absolute;
    bottom: -6px;
    left: -10px;
    right: -10px;
    height: 6px;
    background: #1B5E20;
    border-radius: 2px;
  }
  .icon-graduation::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 20px;
    height: 3px;
    background: #FFD700;
    border-radius: 2px;
  }
`;
if (!document.head.querySelector('style[data-icons]')) {
  iconStyle.setAttribute('data-icons', 'true');
  document.head.appendChild(iconStyle);
}

export const HomePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('academics');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handlePortalsClick = () => {
    navigate('/login');
  };

  const programs = [
    {
      title: 'Junior Secondary',
      grades: 'Form 1 - 2',
      description: 'Competence based curriculum with the following pathways: natural sciences, business and finance, food and hospitality, social sciences',
      icon: <BookOpen className="w-12 h-12 text-green-800" />,
    },
    {
      title: 'Senior Secondary',
      grades: 'Form 3 - 4, Grade 10 - 12',
      description: 'Advanced preparation for university and career pathways',
      icon: <GraduationCap className="w-12 h-12 text-green-800" />,
    },
  ];

  const facilities = [
    { name: 'Science Laboratory', description: 'Fully equipped lab for practical learning' },
    { name: 'Home Economics Lab', description: 'Modern facilities for cooking and home management skills' },
    { name: 'Sports Grounds', description: 'Football, netball, and athletics facilities' },
  ];

  const coCurricular = [
    { name: 'Sports & Athletics', description: 'Football, volleyball, track and field' },
    { name: 'Academic Clubs', description: 'Parliament club, JETS club' },
    { name: 'Arts & Culture', description: 'Music, drama, traditional dance, visual arts' },
    { name: 'Leadership Programs', description: 'Prefect system, community service' },
    { name: 'Skills Development', description: 'Computer literacy, entrepreneurship, public speaking' },
    { name: 'Production Unit', description: 'Agricultural projects, handicrafts, school enterprise' },
  ];

  const staff = [
    { name: 'Teaching Staff', description: 'Qualified and experienced teachers dedicated to student success' },
    { name: 'Administrative Staff', description: 'Professional team ensuring smooth school operations' },
    { name: 'Support Staff', description: 'Dedicated personnel maintaining school facilities and services' },
    { name: 'Management', description: 'Experienced leadership team guiding school excellence' },
  ];

  const resources = [
    { name: 'Study Materials', description: 'Access to textbooks, notes, and educational resources' },
    { name: 'Online Learning', description: 'Digital platforms and e-learning resources' },
    { name: 'Career Guidance', description: 'Counseling and career planning resources' },
    { name: 'Educational Links', description: 'Useful websites and educational portals' },
  ];

  const gallery = [
    { name: 'School Building', description: 'Main school building and facilities', image: '/gallery/campus-life-1.jpg' },
    { name: 'Classroom Setting', description: 'Classroom with desks and learning environment', image: '/gallery/classroom-1.jpg' },
    { name: 'School Grounds', description: 'Open school grounds and outdoor areas', image: '/gallery/sports-1.jpg' },
    { name: 'School Assembly', description: 'Learners gathered for school assembly', image: '/gallery/cultural-1.jpg' },
    { name: 'School Activities', description: 'Learners engaged in school activities', image: '/gallery/science-1.jpg' },
    { name: 'Campus View', description: 'View of the school campus and surroundings', image: '/gallery/school-building.jpg' },
    { name: 'Teaching Staff', description: 'Dedicated teaching staff and educators', image: '/gallery/teachers.jpg' },
  ];

  const news = [
    {
      date: '2025-01-15',
      title: 'Parliament Club Wins Regional Debate',
      excerpt: 'Our Parliament Club members emerged victorious in the regional debate competition, showcasing excellent public speaking and critical thinking skills...',
    },
    {
      date: '2025-01-10',
      title: 'JETS Club Science Exhibition Success',
      excerpt: 'The JETS (Junior Engineers, Technicians, and Scientists) Club organized a successful science exhibition featuring innovative projects from our learners...',
    },
    {
      date: '2025-01-05',
      title: 'Term 1 Academic Calendar Released',
      excerpt: 'The academic calendar for Term 1 is now available for download with important dates and examination schedules...',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
          {/* Navigation */}
          <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img src="/logo.png" alt="Lukulu Day Secondary School Logo" className="h-10 w-auto" />
              <span className="ml-3 text-xl font-bold text-green-800">Lukulu Day Secondary School</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-gray-700 hover:text-green-800 px-3 py-2 rounded-md text-sm font-medium transition transform hover:scale-110 hover:shadow-lg">Home</a>
              <a href="#academics" className="text-gray-700 hover:text-green-800 px-3 py-2 rounded-md text-sm font-medium transition transform hover:scale-110 hover:shadow-lg">Academics</a>
              <a href="#departments" className="text-gray-700 hover:text-green-800 px-3 py-2 rounded-md text-sm font-medium transition transform hover:scale-110 hover:shadow-lg">Departments</a>
              <a href="#admissions" className="text-gray-700 hover:text-green-800 px-3 py-2 rounded-md text-sm font-medium transition transform hover:scale-110 hover:shadow-lg">Admissions</a>
              <a href="#news" className="text-gray-700 hover:text-green-800 px-3 py-2 rounded-md text-sm font-medium transition transform hover:scale-110 hover:shadow-lg">News</a>
              <a href="#contact" className="text-gray-700 hover:text-green-800 px-3 py-2 rounded-md text-sm font-medium transition transform hover:scale-110 hover:shadow-lg">Contact</a>
              <button
                onClick={handlePortalsClick}
                className="bg-green-800 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-900 transition transform hover:scale-110 hover:shadow-lg"
              >
                Portals
              </button>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-700 hover:text-green-800 p-2"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
          
          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <a href="#home" className="block text-gray-700 hover:text-green-800 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium">Home</a>
                <a href="#academics" className="block text-gray-700 hover:text-green-800 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium">Academics</a>
                <a href="#departments" className="block text-gray-700 hover:text-green-800 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium">Departments</a>
                <a href="#admissions" className="block text-gray-700 hover:text-green-800 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium">Admissions</a>
                <a href="#news" className="block text-gray-700 hover:text-green-800 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium">News</a>
                <a href="#contact" className="block text-gray-700 hover:text-green-800 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium">Contact</a>
                <button
                  onClick={handlePortalsClick}
                  className="w-full text-left bg-green-800 text-white px-3 py-2 rounded-md font-semibold hover:bg-green-900"
                >
                  Portals
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative bg-cover bg-center bg-no-repeat text-white" style={{ backgroundImage: 'linear-gradient(rgba(27, 94, 32, 0.8), rgba(27, 94, 32, 0.8)), url(/hero-bg.jpg)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            {/* Logo and School Name Together */}
            <div className="flex flex-col items-center justify-center mb-8">
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-6">
                <img src="/logo.png" alt="LDSS Logo" className="h-16 sm:h-20 md:h-24 w-auto" />
                <div className="text-center sm:text-left">
                  <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                    Lukulu Day Secondary School
                  </h1>
                </div>
              </div>
            </div>
            <p className="text-lg md:text-xl lg:text-2xl mb-4 max-w-3xl mx-auto px-4">
              Soar High like an Eagle for Clear Vision
            </p>
            <p className="text-base md:text-lg lg:text-xl mb-8 max-w-4xl mx-auto text-white/90 px-4">
              A ZEEP government school located in Lavushimanda district, founded in 2021. 
              We are a beacon of educational excellence, nurturing young minds and preparing them for successful futures.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#about"
                className="border-2 border-white/30 text-white px-8 py-3 rounded-md font-semibold hover:bg-white/10 hover:text-green-800 transition"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                About Lukulu Day Secondary School
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Lukulu Day Secondary School is a ZEEP government school located in Lavushimanda district, 
                P.O. Box 450202. Founded in 2021, we are a beacon of educational excellence, 
                nurturing young minds and preparing them for successful futures.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Our school is conveniently located 500m away from the Great North Road, making it 
                easily accessible to learners from surrounding communities. Our commitment to academic 
                excellence, character development, and innovation has made us one of the leading 
                educational institutions in the region.
              </p>
              
              {/* School Leadership */}
              <div className="bg-green-50 rounded-xl p-6 mb-6">
                <h3 className="text-xl font-semibold text-green-800 mb-4">School Leadership</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-start space-x-3">
                    <User className="w-5 h-5 text-green-800 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Headteacher</p>
                      <p className="text-gray-700">Muma Abraham</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <User className="w-5 h-5 text-green-800 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Deputy Headteacher</p>
                      <p className="text-gray-700">Mukisi Desmond</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-800 mb-2">290</div>
                  <div className="text-gray-600">Learners</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-800 mb-2">29</div>
                  <div className="text-gray-600">Staff Members</div>
                </div>
              </div>
            </div>
            <div className="bg-green-100 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-green-800 mb-4">Our Mission</h3>
              <p className="text-gray-700 mb-4">
                To provide quality education that fosters intellectual growth, moral development, 
                and prepares learners to become responsible global citizens.
              </p>
              <h3 className="text-2xl font-bold text-green-800 mb-4">Our Vision</h3>
              <p className="text-gray-700">
                To be a center of educational excellence that produces innovative, ethical, 
                and successful leaders for tomorrow's challenges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Academics Section */}
      <section id="academics" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Discover Lukulu Day Secondary School
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our academics, meet our staff, access resources, browse our gallery, and discover our facilities
            </p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-100 rounded-lg p-1 flex flex-wrap justify-center gap-1">
              {['academics', 'facilities', 'co-curricular', 'staff', 'resources', 'gallery'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 text-sm ${
                    activeTab === tab
                      ? 'bg-green-800 text-white'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  {tab === 'co-curricular' ? 'Co-Curricular' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content - Optimized Rendering */}
          <div className="mt-8">
            {activeTab === 'academics' && (
              <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {programs.map((program, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
                    <div className="mb-4 flex justify-center">{program.icon}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{program.title}</h3>
                    <p className="text-green-800 font-medium mb-2">{program.grades}</p>
                    <p className="text-gray-600">{program.description}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'facilities' && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {facilities.map((facility, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow duration-300">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{facility.name}</h3>
                    <p className="text-gray-600">{facility.description}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'co-curricular' && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coCurricular.map((activity, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{activity.name}</h3>
                    <p className="text-gray-600">{activity.description}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'staff' && (
              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {staff.map((member, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200">
                    <div className="flex items-center space-x-3 mb-3">
                      <Users className="w-6 h-6 text-green-800" />
                      <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                    </div>
                    <p className="text-gray-600">{member.description}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'resources' && (
              <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {resources.map((resource, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200">
                    <div className="flex items-center space-x-3 mb-3">
                      <Award className="w-6 h-6 text-green-800" />
                      <h3 className="text-lg font-semibold text-gray-900">{resource.name}</h3>
                    </div>
                    <p className="text-gray-600">{resource.description}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'gallery' && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gallery.map((item, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
                    <img 
                      src={item.image} 
                      alt={`School photo ${index + 1}`} 
                      className="w-full h-48 object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Admissions Section */}
      <section id="admissions" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Admissions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join our community of learners and leaders
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">How to Apply</h3>
              <div className="space-y-4">
                {[
                  'Obtain application form from school office or website',
                  'Complete and submit form with required documents',
                  'Receive admission letter upon successful evaluation',
                  'Complete registration',
                ].map((step, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-800 text-white rounded-full flex items-center justify-center font-semibold">
                      {index + 1}
                    </div>
                    <p className="ml-4 text-gray-600">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Admission Requirements</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">New Learners (From Primary)</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Statement of Results (Primary)</li>
                    <li>• Birth Certificate/Records</li>
                    <li>• Parent/Guardian ID</li>
                    <li>• Transfer Letter (if applicable)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Grade 10 Entrants</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Grade 9 Certificate</li>
                    <li>• Academic Transcripts</li>
                    <li>• Character Reference</li>
                    <li>• Birth Certificate</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Transfer Learners (Grade 10, 11, 12)</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Transfer Letter from Previous School</li>
                    <li>• School-Based Assessment (SBA) Results</li>
                    <li>• Academic Transcripts</li>
                    <li>• Character Reference</li>
                  </ul>
                </div>
              </div>
              <button className="mt-6 w-full bg-green-800 text-white px-6 py-3 rounded-md font-semibold hover:bg-green-900 transition">
                Download Application Form
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section id="news" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Latest News and Announcements
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay updated with what's happening at Lukulu Day Secondary School
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {news.map((article, index) => (
              <article key={index} className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition">
                <div className="p-6">
                  <div className="text-sm text-green-800 font-medium mb-2">{article.date}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{article.title}</h3>
                  <p className="text-gray-600 mb-4">{article.excerpt}</p>
                  <a href="#" className="text-green-800 font-medium hover:text-green-900">
                    Read More →
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Contact Us
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get in touch with us for more information
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-green-800" />
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900">Address</h4>
                    <p className="text-gray-600">Lavushimanda District, P.O. Box 450202</p>
                    <p className="text-gray-600">500m from Great North Road</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-green-800" />
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900">Phone</h4>
                    <p className="text-gray-600">+260 XXX XXX XXX</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-green-800" />
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900">Email</h4>
                    <p className="text-gray-600">info@lukuludayss.edu.zm</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>
              <form className="space-y-4">
                <div>
                  <input
                    id="contactName"
                    name="contactName"
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-800 focus:border-transparent"
                  />
                </div>
                <div>
                  <input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    placeholder="Your Email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-800 focus:border-transparent"
                  />
                </div>
                <div>
                  <textarea
                    id="contactMessage"
                    name="contactMessage"
                    placeholder="Your Message"
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-800 focus:border-transparent"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-800 text-white px-6 py-3 rounded-md font-semibold hover:bg-green-900 transition"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="departments" className="bg-green-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <img src="/logo.png" alt="LDSS Logo" className="h-12 w-auto mb-4" />
              <p className="text-green-100">
                Excellence in Education, Character Development, and Future Preparation
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-green-100">
                <li><a href="#home" className="hover:text-white">Home</a></li>
                <li><a href="#academics" className="hover:text-white">Academics</a></li>
                <li><a href="#admissions" className="hover:text-white">Admissions</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); handlePortalsClick(); }} className="hover:text-white cursor-pointer">Learner Portal (edurole)</a></li>
                <li><a href="https://www.exams-council.org.zm/" target="_blank" rel="noopener noreferrer" className="hover:text-white">ECZ Portal</a></li>
                <li><a href="https://www.tcz.ac.zm/" target="_blank" rel="noopener noreferrer" className="hover:text-white">TCZ Portal</a></li>
                <li><a href="https://www.moe.gov.zm/" target="_blank" rel="noopener noreferrer" className="hover:text-white">Ministry of Education</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Departments</h4>
              <ul className="space-y-2 text-green-100">
                <li><a href="#" className="hover:text-white">Mathematics</a></li>
                <li><a href="#" className="hover:text-white">Natural Sciences</a></li>
                <li><a href="#" className="hover:text-white">Languages</a></li>
                <li><a href="#" className="hover:text-white">Business</a></li>
                <li><a href="#" className="hover:text-white">Social Sciences</a></li>
                <li><a href="#" className="hover:text-white">Expressive Arts</a></li>
                <li><a href="#" className="hover:text-white">Practical Subjects</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-green-100">
                <li><a href="#" className="hover:text-white">Facebook</a></li>
                <li><a href="#" className="hover:text-white">Twitter</a></li>
                <li><a href="#" className="hover:text-white">Instagram</a></li>
                <li><a href="#" className="hover:text-white">YouTube</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-green-700 text-center text-green-100">
            <p>&copy; 2025 Lukulu Day Secondary School. All rights reserved.</p>
            <p className="text-sm mt-2">Developed by Kahyata Gift Kataka</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
