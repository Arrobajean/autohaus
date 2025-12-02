import { memo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useCurrentYear from "@/hooks/useCurrentYear";
import { useAuth } from "@/context/AuthContext";
import { Settings } from "lucide-react";
import { LoginModal } from "@/components/common/LoginModal";

type FooterProps = {
  showCredit?: boolean;
};

const Footer = memo<FooterProps>(({ showCredit = true }) => {
  const currentYear = useCurrentYear();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleAdminClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      setIsLoginModalOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    // Navegar directamente al admin después del login exitoso
    navigate('/admin/cars');
  };

  return (
    <footer
      id="contact"
      className="bg-white py-20 px-4 sm:px-6"
      style={{ backgroundColor: "#F5F4F2" }}
      role="contentinfo"
      aria-label="Footer information"
    >
      <div className="max-w-7xl mx-auto">
        {/* Logo Section */}
        <div className="flex justify-center mb-16 overflow-visible">
          <Link 
            to="/" 
            className="inline-block"
            onClick={(e) => {
              // Si ya estamos en la página de inicio, hacer scroll al inicio
              if (window.location.pathname === '/') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          >
            <span 
              className="font-bold tracking-tight text-[80px] sm:text-[120px] md:text-[160px] lg:text-[200px] xl:text-[251.983px] whitespace-nowrap"
              style={{
                fontFamily: '"Inter Display", "Inter Display Placeholder", sans-serif',
                color: '#E0E0E0',
                lineHeight: '1',
              }}
            >
              AutoHaus<sup style={{ fontSize: '0.6em', verticalAlign: '0.2em', marginLeft: '0.05em' }}>®</sup>
            </span>
          </Link>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col items-center gap-4 text-sm text-gray-600">
            {/* First line: Copyright */}
            <div className="text-center">
              <p>© {currentYear} Todos los derechos reservados</p>
            </div>

            {/* Second line: Legal Links */}
            <div className="text-center">
              <div className="flex flex-wrap justify-center items-center gap-4">
                <Link
                  to="/politica-privacidad"
                  className="hover:text-gray-900 transition-colors duration-200"
                >
                  Política de Privacidad
                </Link>
                <Link
                  to="/aviso-legal"
                  className="hover:text-gray-900 transition-colors duration-200"
                >
                  Aviso Legal
                </Link>
                <Link
                  to="/politica-cookies"
                  className="hover:text-gray-900 transition-colors duration-200"
                >
                  Política de Cookies
                </Link>
              </div>
            </div>

            {/* Third line: Credit */}
            {showCredit && (
              <div className="text-center">
                <a
                  href="https://www.404studios.digital"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[9px] text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  Sitio desarrollado por 404studios
                </a>
              </div>
            )}

            {/* Fourth line: Admin Access */}
            <div className="text-center">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (user) {
                    navigate('/admin/cars');
                  } else {
                    setIsLoginModalOpen(true);
                  }
                }}
                className="text-[9px] text-gray-400 hover:text-gray-600 transition-colors duration-200 flex items-center justify-center gap-1.5 mx-auto"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Gestión de Coches</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <LoginModal 
        open={isLoginModalOpen} 
        onOpenChange={setIsLoginModalOpen}
        onSuccess={handleLoginSuccess}
      />
    </footer>
  );
});

Footer.displayName = "Footer";

export default Footer;
