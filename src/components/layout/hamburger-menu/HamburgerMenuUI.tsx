import { Link } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SiTiktok, SiInstagram, SiFacebook, SiLinkedin } from "react-icons/si";

interface HamburgerMenuUIProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  isNavVisible: boolean;
  refs: {
    overlayRef: React.RefObject<HTMLDivElement>;
    menuItemsRef: React.RefObject<HTMLDivElement>;
    line1Ref: React.RefObject<HTMLDivElement>;
    line2Ref: React.RefObject<HTMLDivElement>;
    line3Ref: React.RefObject<HTMLDivElement>;
  };
}

const navigationItems = [
  { label: "Inicio", pagePath: "/" },
  { label: "Nosotros", pagePath: "/nosotros" },
  { label: "Servicios", pagePath: "/servicios" },
  { label: "Blog", pagePath: "/blog" },
  { label: "Contacto", pagePath: "/contacto" },
];

export const HamburgerMenuUI = ({
  isOpen,
  onToggle,
  onClose,
  isNavVisible,
  refs,
}: HamburgerMenuUIProps) => {
  return (
    <>
      {/* Botón Hamburguesa con líneas animadas */}
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onToggle}
            style={{
              position: "relative",
              width: "48px",
              height: "48px",
              backgroundColor: "transparent",
              border: "none",
              borderRadius: "8px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              gap: "4px",
              zIndex: 10002,
            }}
            aria-label={
              isOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"
            }
            aria-expanded={isOpen}
            aria-haspopup="menu"
            aria-controls="hamburger-menu"
            className="focus:outline-none"
          >
            <div
              ref={refs.line1Ref}
              style={{
                width: "22px",
                height: "2px",
                backgroundColor: "white",
                borderRadius: "1px",
                transformOrigin: "center",
              }}
              aria-hidden="true"
            />
            <div
              ref={refs.line2Ref}
              style={{
                width: "22px",
                height: "2px",
                backgroundColor: "white",
                borderRadius: "1px",
              }}
              aria-hidden="true"
            />
            <div
              ref={refs.line3Ref}
              style={{
                width: "22px",
                height: "2px",
                backgroundColor: "white",
                borderRadius: "1px",
              }}
              aria-hidden="true"
            />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isOpen ? "Cerrar menú" : "Abrir menú"}</p>
        </TooltipContent>
      </Tooltip>

      {/* Overlay de fondo con efecto blur */}
      <div
        ref={refs.overlayRef}
        id="hamburger-menu"
        role="dialog"
        aria-modal="true"
        aria-labelledby="hamburger-menu-title"
        aria-describedby="hamburger-menu-description"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100dvh",
          zIndex: 10000,
          overflow: "hidden",
          isolation: "isolate",
        }}
      >
        {/* Contenedor con fondo negro sólido */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "var(--black-custom)",
            transition: "all 0.3s ease",
          }}
        >
          {/* Menú de navegación */}
          <div
            id="hamburger-menu-description"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
              padding: "20px",
              boxSizing: "border-box",
            }}
          >
            {/* Título oculto para lectores de pantalla */}
            <h1 id="hamburger-menu-title" className="sr-only">
              Menú principal de AutoHaus
            </h1>

            {/* Elementos del menú */}
            <nav
              ref={refs.menuItemsRef}
              role="navigation"
              aria-label="Navegación principal"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "clamp(24px, 4vw, 32px)",
                marginBottom: "clamp(48px, 8vw, 64px)",
                width: "100%",
                maxWidth: "400px",
              }}
            >
              {navigationItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.pagePath}
                  onClick={() => {
                    onClose();
                  }}
                  className="hamburger-menu-item focus:outline-none rounded-md"
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    textDecoration: "none",
                    textAlign: "center",
                    width: "100%",
                    fontSize: "clamp(24px, 6vw, 32px)",
                  }}
                  aria-label={`${item.label} - ${
                    item.pagePath === "/"
                      ? "Ir al inicio"
                      : `Ir a ${item.label.toLowerCase()}`
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Redes sociales en la parte inferior */}
            <div
              style={{
                position: "absolute",
                bottom: "max(72px, env(safe-area-inset-bottom, 0px) + 24px)",
                left: "50%",
                transform: "translateX(-50%)",
                textAlign: "center",
              }}
              role="complementary"
              aria-label="Redes sociales"
            >
              {/* CTA breve */}
              <p
                style={{
                  color: "white",
                  fontSize: "clamp(14px, 3vw, 16px)",
                  fontWeight: "500",
                  marginBottom: "16px",
                  opacity: 0.9,
                }}
              >
                Síguenos en nuestras redes
              </p>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                <a
                  href="https://www.facebook.com/profile.php?id=100063475091329"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: "48px",
                    height: "48px",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    textDecoration: "none",
                    transition: "all 0.3s ease",
                  }}
                  className="hover:bg-[#2563eb] hover:scale-110"
                  aria-label="Visitar perfil de Facebook de AutoHaus (se abre en ventana nueva)"
                >
                  <SiFacebook size={20} aria-hidden="true" />
                </a>
                <a
                  href="https://www.instagram.com/autohaus"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: "48px",
                    height: "48px",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    textDecoration: "none",
                    transition: "all 0.3s ease",
                  }}
                  className="hover:bg-[#2563eb] hover:scale-110"
                  aria-label="Visitar perfil de Instagram de AutoHaus (se abre en ventana nueva)"
                >
                  <SiInstagram size={20} aria-hidden="true" />
                </a>
                <a
                  href="https://www.tiktok.com/@autohaus"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: "48px",
                    height: "48px",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    textDecoration: "none",
                    transition: "all 0.3s ease",
                  }}
                  className="hover:bg-[#2563eb] hover:scale-110"
                  aria-label="Visitar perfil de TikTok de AutoHaus (se abre en ventana nueva)"
                >
                  <SiTiktok size={20} aria-hidden="true" />
                </a>
                <a
                  href="https://www.linkedin.com/company/autohaus-consulta-de-psicología-y-logopedia/posts/?feedView=all"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: "48px",
                    height: "48px",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    textDecoration: "none",
                    transition: "all 0.3s ease",
                  }}
                  className="hover:bg-[#2563eb] hover:scale-110"
                  aria-label="Visitar perfil de LinkedIn de AutoHaus (se abre en ventana nueva)"
                >
                  <SiLinkedin size={20} aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
