import React from 'react';

/**
 * Official emblem of Junák - český skaut
 * Matching the exact visual identity:
 * - Blue trefoil (světlušky & skautky)
 * - Golden fleur-de-lis (vlčata & skauti)
 * - White shield with the Chod dog head (chodský pes) designed by Mikoláš Aleš
 */
export const JunakOfficialLogo: React.FC<{ className?: string; title?: string }> = ({ 
  className = 'w-10 h-10',
  title = 'Junák – český skaut'
}) => {
  return (
    <svg 
      className={className} 
      viewBox="0 0 300 340" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
    >
      <title>{title}</title>

      {/* 1. BLUE TREFOIL (Trojlístek) */}
      <g id="trefoil">
        {/* Outlines & fill for the 3 lobes */}
        {/* Top lobe */}
        <circle cx="150" cy="95" r="75" fill="#004d9c" stroke="#002d62" strokeWidth="7" />
        {/* Left lobe */}
        <circle cx="80" cy="185" r="75" fill="#004d9c" stroke="#002d62" strokeWidth="7" />
        {/* Right lobe */}
        <circle cx="220" cy="185" r="75" fill="#004d9c" stroke="#002d62" strokeWidth="7" />
        {/* Center blend to create solid clover */}
        <path d="M150 95 L80 185 L220 185 Z" fill="#004d9c" />
      </g>

      {/* 2. GOLDEN SCOUT LILY (Skautská lilie) */}
      <g id="fleur-de-lis">
        {/* Central petal */}
        <path 
          d="M150 8 
             C132 55 108 105 110 148 
             C112 170 125 180 150 180 
             C175 180 188 170 190 148 
             C192 105 168 55 150 8 Z" 
          fill="#f2b705" 
          stroke="#8d4b00" 
          strokeWidth="6" 
          strokeLinejoin="round"
        />
        {/* Central rib dividing the middle petal */}
        <path d="M150 12 L150 145" stroke="#8d4b00" strokeWidth="5" strokeLinecap="round" />

        {/* Left wing petal */}
        <path 
          d="M125 145 
             C95 125 45 105 22 135 
             C10 150 12 175 25 190 
             C38 205 60 215 62 235 
             C64 255 58 262 55 268 
             C65 268 78 250 80 230 
             C82 205 70 190 58 175 
             C48 162 52 145 75 140 
             C98 135 120 150 128 170 
             C132 178 135 190 140 200" 
          fill="#f2b705" 
          stroke="#8d4b00" 
          strokeWidth="6" 
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Right wing petal */}
        <path 
          d="M175 145 
             C205 125 255 105 278 135 
             C290 150 288 175 275 190 
             C262 205 240 215 238 235 
             C236 255 242 262 245 268 
             C235 268 222 250 220 230 
             C218 205 230 190 242 175 
             C252 162 248 145 225 140 
             C202 135 180 150 172 170 
             C168 178 165 190 160 200" 
          fill="#f2b705" 
          stroke="#8d4b00" 
          strokeWidth="6" 
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Bottom downward petal */}
        <path 
          d="M130 250 
             C140 270 146 310 150 332 
             C154 310 160 270 170 250 
             C160 252 140 252 130 250 Z" 
          fill="#f2b705" 
          stroke="#8d4b00" 
          strokeWidth="5" 
          strokeLinejoin="round"
        />
        <path d="M150 260 L150 328" stroke="#8d4b00" strokeWidth="4" strokeLinecap="round" />

        {/* Bottom upward curls */}
        <path 
          d="M150 245 
             C135 260 105 285 85 275 
             C72 268 70 255 78 245 
             C85 235 98 238 105 248 
             C112 258 128 252 142 240" 
          fill="#f2b705" 
          stroke="#8d4b00" 
          strokeWidth="5" 
          strokeLinejoin="round"
        />
        <path 
          d="M150 245 
             C165 260 195 285 215 275 
             C228 268 230 255 222 245 
             C215 235 202 238 195 248 
             C188 258 172 252 158 240" 
          fill="#f2b705" 
          stroke="#8d4b00" 
          strokeWidth="5" 
          strokeLinejoin="round"
        />
      </g>

      {/* 3. CENTRAL SHIELD (Štítek) */}
      <g id="shield">
        <path 
          d="M108 140 
             L192 140 
             L202 165 
             C198 220 168 255 150 268 
             C132 255 102 220 98 165 
             Z" 
          fill="#ffffff" 
          stroke="#8d4b00" 
          strokeWidth="7" 
          strokeLinejoin="round"
        />
      </g>

      {/* 4. CHOD DOG HEAD (Hlava Chodského psa) */}
      <g id="chod-dog" fill="#002958">
        {/* Head profile silhouette facing left */}
        <path 
          d="M125 160 
             C135 156 155 152 172 152 
             C176 152 182 148 185 145 
             L188 158 
             C186 165 178 170 184 175 
             C188 178 182 188 178 192 
             C175 198 180 205 176 215 
             C170 226 160 236 150 242 
             C142 245 138 235 142 230 
             C146 226 142 220 138 215 
             C135 210 132 205 138 200 
             C134 196 130 190 132 185 
             L115 185 
             C112 180 114 175 120 172 
             L112 172 
             C110 167 114 163 125 160 Z"
        />
        {/* Snout with nose and jaws */}
        <path 
          d="M125 160 
             L105 165 
             C102 167 104 173 110 174 
             L125 174 
             L120 182 
             L130 182 
             Z"
        />
        {/* Tongue sticking out */}
        <path 
          d="M110 172 
             C102 172 96 175 95 180 
             C94 185 98 188 104 187 
             C110 186 112 182 115 177 Z" 
        />
        {/* Dog Eye in white */}
        <circle cx="140" cy="165" r="3.5" fill="#ffffff" />
        {/* Snout detail slit in white */}
        <path d="M126 169 L115 169" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
        {/* Ear inner detail in white */}
        <path d="M178 156 L183 150" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
        {/* Neck fur tuft details in white */}
        <circle cx="178" cy="216" r="3" fill="#ffffff" />
        <circle cx="150" cy="235" r="3.5" fill="#ffffff" />
      </g>
    </svg>
  );
};

export default JunakOfficialLogo;
