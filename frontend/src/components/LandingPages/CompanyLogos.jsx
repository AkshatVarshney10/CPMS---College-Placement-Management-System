import React from 'react';

// Official Vector SVG Logos for 24 Top Global Recruiters with Original Brand Colors
const GoogleLogo = () => (
  <svg className="w-full h-full max-h-8 object-contain" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M26 30c0-1.8-.2-3.5-.5-5.2H5v9.8h11.9c-.5 2.8-2.1 5.2-4.5 6.8v5.6h7.3c4.3-3.9 6.8-9.8 6.8-17z" fill="#4285F4"/>
    <path d="M12.4 43.8c4.6 0 8.5-1.5 11.3-4.2l-7.3-5.6c-2 1.4-4.6 2.2-7.5 2.2-5.7 0-10.6-3.9-12.3-9.1H1.2v5.8c2.8 5.6 8.6 10.9 11.2 10.9z" fill="#34A853"/>
    <path d="M6.6 27.1c-.4-1.4-.7-2.9-.7-4.4s.3-3 .7-4.4v-5.8H1.2C-.1 15.2-.7 18.5-.7 22.7s.6 7.5 1.9 10.2l5.4-5.8z" fill="#FBBC05"/>
    <path d="M12.4 9.8c3.2 0 6.1 1.1 8.4 3.2l6.3-6.3C23.3 3.3 18.3 1.5 12.4 1.5c-5.9 0-11.7 5.3-14.5 10.9l5.4 5.8c1.7-5.2 6.6-8.4 12.3-8.4z" fill="#EA4335"/>
    <text x="56" y="38" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="28" fill="#5F6368">Google</text>
  </svg>
);

const MicrosoftLogo = () => (
  <svg className="w-full h-full max-h-8 object-contain" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="10" width="16" height="16" fill="#F25022"/>
    <rect x="25" y="10" width="16" height="16" fill="#7FBA00"/>
    <rect x="6" y="29" width="16" height="16" fill="#00A4EF"/>
    <rect x="25" y="29" width="16" height="16" fill="#FFB900"/>
    <text x="48" y="37" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="24" fill="#737373">Microsoft</text>
  </svg>
);

const AmazonLogo = () => (
  <svg className="w-full h-full max-h-8 object-contain" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M142 42c-12 8-28 12-42 12-20 0-38-7-51-19-1-1 0-2 1-1 14 8 32 13 50 13 13 0 27-3 40-10 2-1 3 2 2 4z" fill="#FF9900"/>
    <path d="M147 37c-1-1-6-.6-9-.3-.8.1-.9-.6-.3-1 4-2.8 10.5-2 11.5-.6 1 1.4-.2 8-3.8 11.3-.6.6-1.2.3-1-.4.8-2.3 3.6-7.5 2.6-9z" fill="#FF9900"/>
    <text x="10" y="34" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="30" fill="#141414" letterSpacing="-1">amazon</text>
  </svg>
);

const AdobeLogo = () => (
  <svg className="w-full h-full max-h-8 object-contain" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="8" width="38" height="44" fill="#FA0F00"/>
    <path d="M24 16h6l7 28h-5l-2-7h-8l-1.5 7h-4.5l7-28zm4.5 16l-2.8-10-2.8 10h5.6z" fill="#FFFFFF"/>
    <text x="56" y="40" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="28" fill="#FA0F00" letterSpacing="-0.5">Adobe</text>
  </svg>
);

const MetaLogo = () => (
  <svg className="w-full h-full max-h-8 object-contain" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M35 15c-5 0-9.5 2.5-13 7-3.5-4.5-8-7-13-7-7.5 0-13.5 6-13.5 14.5S1.5 44 9 44c5 0 9.5-2.5 13-7 3.5 4.5 8 7 13 7 7.5 0 13.5-6 13.5-14.5S42.5 15 35 15zm-26 23c-4.5 0-8-3.5-8-8.5s3.5-8.5 8-8.5c3.5 0 6.5 2 9.5 6-3 4-6 11-9.5 11zm26 0c-3.5 0-6.5-7-9.5-11 3-4 6-6 9.5-6 4.5 0 8 3.5 8 8.5s-3.5 8.5-8 8.5z" fill="#0668E1"/>
    <text x="56" y="38" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="28" fill="#0668E1">Meta</text>
  </svg>
);

const CiscoLogo = () => (
  <svg className="w-full h-full max-h-8 object-contain" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g fill="#049FD9">
      <rect x="10" y="20" width="3.5" height="12" rx="1.75"/>
      <rect x="17" y="14" width="3.5" height="18" rx="1.75"/>
      <rect x="24" y="8" width="3.5" height="24" rx="1.75"/>
      <rect x="31" y="14" width="3.5" height="18" rx="1.75"/>
      <rect x="38" y="20" width="3.5" height="12" rx="1.75"/>
    </g>
    <text x="52" y="38" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="28" fill="#049FD9" letterSpacing="2.5">CISCO</text>
  </svg>
);

const SamsungLogo = () => (
  <svg className="w-full h-full max-h-8 object-contain" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="100" cy="30" rx="92" ry="24" fill="#034EA2" transform="rotate(-8 100 30)"/>
    <text x="24" y="37" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="21" fill="#FFFFFF" letterSpacing="2.5" transform="rotate(-8 100 30)">SAMSUNG</text>
  </svg>
);

const IntelLogo = () => (
  <svg className="w-full h-full max-h-8 object-contain" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="10" y="44" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="42" fill="#0071C5" letterSpacing="-1.5">intel</text>
    <circle cx="124" cy="16" r="4.5" fill="#0071C5"/>
  </svg>
);

const QualcommLogo = () => (
  <svg className="w-full h-full max-h-8 object-contain" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="5" y="40" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="26" fill="#3253DC" letterSpacing="-0.5">Qualcomm</text>
  </svg>
);

const NvidiaLogo = () => (
  <svg className="w-full h-full max-h-8 object-contain" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 32c6-10 18-12 24-4 4 5 3 14-4 18-6 3-15 1-20-4V46h-6V14h6v18z" fill="#76B900"/>
    <text x="50" y="38" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="26" fill="#141414" letterSpacing="1">NVIDIA</text>
  </svg>
);

const FlipkartLogo = () => (
  <svg className="w-full h-full max-h-8 object-contain" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="10" width="36" height="40" rx="8" fill="#2874F0"/>
    <path d="M26 18h11v5h-6v4h5v4h-5v9h-5V18z" fill="#FFE11B"/>
    <text x="52" y="38" fontFamily="Arial, sans-serif" fontStyle="italic" fontWeight="900" fontSize="26" fill="#2874F0">Flipkart</text>
  </svg>
);

const PaypalLogo = () => (
  <svg className="w-full h-full max-h-8 object-contain" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 10h14c6 0 10 4 9 10s-6 10-12 10h-5l-3 15h-8l8-35z" fill="#003087"/>
    <path d="M22 18h14c6 0 10 4 9 10s-6 10-12 10h-5l-3 15h-8l8-35z" fill="#0079C1" opacity="0.85"/>
    <text x="54" y="38" fontFamily="Arial, sans-serif" fontStyle="italic" fontWeight="bold" fontSize="26" fill="#003087">PayPal</text>
  </svg>
);

const AtlassianLogo = () => (
  <svg className="w-full h-full max-h-8 object-contain" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 12c-4 5-8 15-4 24l12 12c-1-10 1-24-8-36z" fill="#0052CC"/>
    <path d="M24 22c-2 6-2 14 3 20l9 6c-2-8-2-18-12-26z" fill="#2684FF"/>
    <text x="50" y="38" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="24" fill="#0052CC">ATLASSIAN</text>
  </svg>
);

const UberLogo = () => (
  <svg className="w-full h-full max-h-8 object-contain" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="10" y="42" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="38" fill="#000000" letterSpacing="-1">Uber</text>
  </svg>
);

const LinkedinLogo = () => (
  <svg className="w-full h-full max-h-8 object-contain" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="10" width="38" height="38" rx="6" fill="#0A66C2"/>
    <text x="16" y="38" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="28" fill="#FFFFFF">in</text>
    <text x="54" y="38" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="26" fill="#0A66C2">LinkedIn</text>
  </svg>
);

const SalesforceLogo = () => (
  <svg className="w-full h-full max-h-8 object-contain" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 18c3-4 8-6 13-4 4-6 13-7 19-2 5-2 11 1 13 6 4 1 7 5 6 9 3 2 4 6 3 10H10c-3-4-2-10 2-13 1-3 4-5 8-6z" fill="#00A1E0"/>
    <text x="64" y="38" fontFamily="Arial, sans-serif" fontStyle="italic" fontWeight="bold" fontSize="20" fill="#00A1E0">salesforce</text>
  </svg>
);

const IbmLogo = () => (
  <svg className="w-full h-full max-h-8 object-contain" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="10" y="44" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="42" fill="#052FAD" letterSpacing="4">IBM</text>
  </svg>
);

const AccentureLogo = () => (
  <svg className="w-full h-full max-h-8 object-contain" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 12l16 8-16 8v-16z" fill="#A100FF"/>
    <text x="10" y="44" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="24" fill="#141414">accenture</text>
  </svg>
);

const DeloitteLogo = () => (
  <svg className="w-full h-full max-h-8 object-contain" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="5" y="38" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="28" fill="#000000" letterSpacing="-0.5">Deloitte.</text>
    <circle cx="118" cy="34" r="3.5" fill="#86BC25"/>
  </svg>
);

const InfosysLogo = () => (
  <svg className="w-full h-full max-h-8 object-contain" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="10" y="40" fontFamily="Georgia, serif" fontWeight="bold" fontSize="30" fill="#007CC3" letterSpacing="-0.5">Infosys</text>
  </svg>
);

const TcsLogo = () => (
  <svg className="w-full h-full max-h-8 object-contain" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="5" y="38" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="32" fill="#003366" letterSpacing="1">tcs</text>
    <text x="65" y="34" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="12" fill="#003366">TATA</text>
    <text x="65" y="46" fontFamily="Arial, sans-serif" fontWeight="normal" fontSize="10" fill="#555555">CONSULTANCY</text>
  </svg>
);

const WiproLogo = () => (
  <svg className="w-full h-full max-h-8 object-contain" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="20" r="5" fill="#7B2CBF"/>
    <circle cx="26" cy="16" r="4" fill="#0077B6"/>
    <circle cx="34" cy="24" r="5" fill="#2A9D8F"/>
    <circle cx="20" cy="30" r="4" fill="#E76F51"/>
    <text x="44" y="38" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="28" fill="#141414">wipro</text>
  </svg>
);

const GoldmanSachsLogo = () => (
  <svg className="w-full h-full max-h-8 object-contain" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="6" width="190" height="48" rx="4" fill="#7399C6"/>
    <text x="18" y="27" fontFamily="Georgia, serif" fontWeight="bold" fontSize="17" fill="#FFFFFF" letterSpacing="0.5">Goldman</text>
    <text x="18" y="45" fontFamily="Georgia, serif" fontWeight="bold" fontSize="17" fill="#FFFFFF" letterSpacing="0.5">Sachs</text>
  </svg>
);

const OracleLogo = () => (
  <svg className="w-full h-full max-h-8 object-contain" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 12c-10 0-18 8-18 18s8 18 18 18h12c10 0 18-8 18-18s-8-18-18-18H20zm0 28c-5.5 0-10-4.5-10-10s4.5-10 10-10h12c5.5 0 10 4.5 10 10s-4.5 10-10 10H20z" fill="#EA1C24"/>
    <text x="60" y="38" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="26" fill="#EA1C24" letterSpacing="1.5">ORACLE</text>
  </svg>
);

const companiesList = [
  { name: 'Google', logo: GoogleLogo },
  { name: 'Microsoft', logo: MicrosoftLogo },
  { name: 'Amazon', logo: AmazonLogo },
  { name: 'Adobe', logo: AdobeLogo },
  { name: 'Meta', logo: MetaLogo },
  { name: 'Cisco', logo: CiscoLogo },
  { name: 'Samsung', logo: SamsungLogo },
  { name: 'Intel', logo: IntelLogo },
  { name: 'Qualcomm', logo: QualcommLogo },
  { name: 'NVIDIA', logo: NvidiaLogo },
  { name: 'Flipkart', logo: FlipkartLogo },
  { name: 'PayPal', logo: PaypalLogo },
  { name: 'Atlassian', logo: AtlassianLogo },
  { name: 'Uber', logo: UberLogo },
  { name: 'LinkedIn', logo: LinkedinLogo },
  { name: 'Salesforce', logo: SalesforceLogo },
  { name: 'IBM', logo: IbmLogo },
  { name: 'Accenture', logo: AccentureLogo },
  { name: 'Deloitte', logo: DeloitteLogo },
  { name: 'Infosys', logo: InfosysLogo },
  { name: 'TCS', logo: TcsLogo },
  { name: 'Wipro', logo: WiproLogo },
  { name: 'Goldman Sachs', logo: GoldmanSachsLogo },
  { name: 'Oracle', logo: OracleLogo },
];

export default function CompanyLogos() {
  // Duplicate array twice to ensure 100% continuous, infinite marquee scroll
  const marqueeList = [...companiesList, ...companiesList];

  return (
    <div className="w-full pt-10 border-t border-stone-200/80">
      <h3 className="text-xs sm:text-sm font-extrabold tracking-wider text-stone-500 uppercase mb-8 text-center">
        Trusted by Leading Global Companies & Top Recruiters
      </h3>

      <div className="relative w-full overflow-hidden py-4">
        {/* Soft edge gradient fades */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

        {/* Continuous Infinite Marquee Ribbon */}
        <div className="flex w-max animate-marquee space-x-6 hover:[animation-play-state:paused]">
          {marqueeList.map((company, index) => {
            const LogoComp = company.logo;
            return (
              <div
                key={index}
                className="group relative bg-white border border-stone-200/90 rounded-2xl w-44 h-20 px-5 flex items-center justify-center shadow-xs hover:shadow-lg hover:shadow-amber-500/10 hover:-translate-y-1.5 hover:scale-[1.03] transition-all duration-250 cursor-pointer shrink-0"
                title={company.name}
              >
                <div className="w-full h-full flex items-center justify-center transition-all duration-250">
                  <LogoComp />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
